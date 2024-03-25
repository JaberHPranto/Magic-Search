"use client";
import React, { useRef, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const SearchBar = () => {
  const [isSearching, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const defaultQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState(defaultQuery);

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = () => {
    startTransition(() => {
      router.push(`/search?query=${query}`);
    });
  };

  const handleFocus = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      inputRef?.current?.blur();
    }
  };

  return (
    <div className="relative w-full h-14 flex flex-col bg-white">
      <div className="relative h-14 z-10 rounded-md">
        <Input
          ref={inputRef}
          onKeyDown={handleFocus}
          disabled={isSearching}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="absolute inset-0 h-full text-lg"
        />
        <Button
          className="absolute right-0 inset-y-0 h-full rounded-lg"
          disabled={isSearching}
          onClick={handleSearch}
        >
          {isSearching ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Search />
          )}
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
