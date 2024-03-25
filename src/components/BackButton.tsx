"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button
      className="flex items-center gap-2 text-sm pb-2"
      variant="secondary"
      onClick={() => router.back()}
    >
      <ChevronLeft className="size-4" /> Back
    </Button>
  );
};

export default BackButton;
