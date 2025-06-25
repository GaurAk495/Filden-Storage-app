"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PaginationButton({ total }: { total: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1");

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };
  const totalPages = Math.ceil(total / 25);

  return (
    <div className="flex justify-center items-center gap-3 my-4">
      <Button
        onClick={() => changePage(Math.max(page - 1, 1))}
        disabled={page <= 1}
      >
        Prev
      </Button>
      <span className="text-sm text-muted-foreground">Page {page}</span>
      <Button
        onClick={() => changePage(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
