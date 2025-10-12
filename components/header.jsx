"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/marketplace/${query}`);
  };

  return (
    <header className="px-7 py-3 flex items-center gap-3 justify-between">
      <a href="/dashboard" className="flex items-center">
        <img src="/assets/logo/logo.png" alt="logo" className="w-[4rem]" />
        <h1 className="text-2xl font-semibold">Digimart</h1>
      </a>

      <form
        onSubmit={handleSearch}
        className="flex items-center gap-3 border-border border-2 shadow-2xs rounded-full px-5 py-2 w-1/2"
      >
        <Search className="text-gray-600" />
        <input
          type="text"
          placeholder="Search products"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="outline-none w-full"
        />
      </form>
    </header>
  );
};

export default Header;
