import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import Link from "next/link";
import { Search } from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import { getFiles } from "@/action/fileStorage.action";
import { Models } from "node-appwrite";
import { formatDate, urlmaker } from "@/lib/utils";
import Thumbnail from "./Thumbnail";

function HeaderSearch() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Models.Document[] | null>([]);
  const debouncedSearchTerm = useDebounce(search, 400);
  const router = useRouter();
  useEffect(() => {
    const fetchSearches = async () => {
      const results = await getFiles({ query: debouncedSearchTerm });
      setResults(results);
    };

    // Optional: only fetch if slug exists and/or search is not empty
    if (debouncedSearchTerm || debouncedSearchTerm !== "") {
      fetchSearches();
    }
    if (debouncedSearchTerm === "") {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  const handleOnClick = (item: Models.Document) => {
    setSearch("");
    router.push(urlmaker(item.title, item.type));
  };
  return (
    <div className="relative w-1/3">
      <Input
        placeholder="Search your files..."
        className="w-full rounded-xl outline-0 border-0"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Link href={`?query=${search}`}>
        <Search
          color="gray"
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer hover:text-black"
        />
      </Link>
      {results && results?.length > 0 && (
        <div className="absolute bg-white w-sm  left-0 right-0 z-20 shadow rounded-2xl mt-2 p-3 space-y-4 border">
          {results.map((item) => (
            <div
              key={item.$id}
              className="flex w-full max-w-[500px] flex-row items-center gap-2 cursor-pointer"
              onClick={() => handleOnClick(item)}
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-[25px] h-[25px]">
                <Thumbnail file={item} size={25} />
              </div>

              {/* Title */}
              <p className="flex-grow text-sm truncate">{item.title}</p>

              {/* Date */}
              <p className="text-[10px] text-slate-700 ml-2 whitespace-nowrap">
                {formatDate(item.$createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HeaderSearch;
