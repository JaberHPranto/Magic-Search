import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Check, Shield } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

interface Props {
  params: {
    productId: string;
  };
}

const ProductDetailsPage = async ({ params }: Props) => {
  const { productId } = params;

  if (!productId) return notFound();

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, productId));

  if (!product) return notFound();

  return (
    <div className="pt-8 pb-12 px-12  bg-white shadow-md rounded-b-md">
      <div>
        <BackButton />

        <div className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {product.name}
          </h1>
        </div>

        <div className="aspect-square my-6 border border-border size-52">
          <div className="relative bg-zinc-100 size-full overflow-hidden rounded-xl">
            <Image
              loading="eager"
              fill
              className="size-full object-cover object-center"
              src={`/${product.imageId}`}
              alt={product.name}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center">
            <p className="font-semibold text-gray-900">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div className="mt-4 space-y-6">
            <p className="text-base max-w-prose text-muted-foreground">
              {product.description}
            </p>
          </div>

          <div className="mt-6 flex items-center">
            <Check className="size-5 text-green-500" />
            <p className="ml-2 text-sm text-muted-foreground">
              Eligible for express delivery
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button className="w-full mt-10">Add to cart</Button>

        <div className="inline-flex text-sm text-medium mt-3">
          <Shield className="size-5 mr-2 text-gray-700" />
          <span className="text-muted-foreground hover:text-gray-700">
            30 Day Return Guarantee
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
