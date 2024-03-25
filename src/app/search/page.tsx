import { db } from "@/db";
import { Product, productsTable } from "@/db/schema";
import { vectorize } from "@/lib/vectorize";
import { Index } from "@upstash/vector";
import { sql } from "drizzle-orm";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export type CoreProduct = Omit<Product, "createdAt" | "updatedAt">;

// vector database
const index = new Index<CoreProduct>();

const SearchPage = async ({ searchParams }: Props) => {
  const query = searchParams.query;

  if (!query || Array.isArray(query)) {
    redirect("/");
  }

  /* FULL TEXT SEARCH */
  let products: CoreProduct[] = await db
    .select()
    .from(productsTable)
    .where(
      // postgres full text search
      sql`to_tsvector('simple', lower(${productsTable.name} || ' ' || ${
        productsTable.description // pre-processing - stop words, lexemes, word count
      })) @@ to_tsquery('simple', lower(${query
        .trim()
        .split(" ")
        .join(" & ")}))` // pg searches `Bomber Jacket` to Bomber & Jacket (pg doesn't take multiple search params without logical operator)`
    )
    .limit(3);

  /* SEMANTIC SEARCH */
  if (products.length < 3) {
    // do semantic search
    const vector = await vectorize(query);

    // search in vector database (upstash)
    const res = index.query({
      topK: 5,
      vector,
      includeMetadata: true,
    });

    const vectorProducts = (await res)

      .filter((existingProduct) => {
        if (
          products.some((product) => product.id === existingProduct.id) ||
          existingProduct.score < 0.9
        ) {
          return false;
        } else return true;
      })
      .map(({ metadata }) => metadata!);

    products.push(...vectorProducts);
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-4 bg-white shadow-md rounded-b-md">
        <X className="size-8 mx-auto text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No Result</h3>
        <p className="mt-1 text-sm mx-auto max-w-prose font-medium">
          Sorry, we could not find any matches for{" "}
          <span className="text-green-600 font-medium">{query}</span>
        </p>
      </div>
    );
  }

  return (
    <ul className="py-4 divide-y-4 divide-zinc-100 bg-white shadow-md rounded-b-md">
      {products.slice(0, 3).map((product) => (
        <Link key={product.id} href={`/product/${product.id}`}>
          <li className="py-4 px-8 mx-auto flex space-x-4">
            <div className="relative flex items-center bg-zinc-50 size-40">
              <Image
                loading="eager"
                fill
                src={`/${product.imageId}`}
                alt={product.name}
              />
            </div>

            <div className="w-full flex-1 space-y-2 py-2">
              <h1 className="text-lg font-medium text-gray-900">
                {product.name}
              </h1>

              <p className="prose prose-sm text-gray-500 line-clamp-3">
                {product.description}
              </p>

              <p className="text-base font-semibold text-gray-90">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default SearchPage;
