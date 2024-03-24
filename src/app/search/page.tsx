import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { sql } from "drizzle-orm";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const SearchPage = async ({ searchParams }: Props) => {
  const query = searchParams.query;

  if (!query || Array.isArray(query)) {
    redirect("/");
  }

  let products = await db
    .select()
    .from(productsTable)
    .where(
      // postgres full text search
      sql`to_tsvector('simple', lower(${productsTable.name} || ' ' || ${
        productsTable.description
      })) @@ to_tsquery('simple', lower(${query
        .trim()
        .split(" ")
        .join(" & ")}))` // pg searches `Bomber Jacket` to Bomber & Jacket`
    )
    .limit(3);

  return <pre>{JSON.stringify(products)}</pre>;
};

export default SearchPage;
