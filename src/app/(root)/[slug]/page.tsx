import { getFiles } from "@/action/fileStorage.action";
import FileCard from "@/components/FileCard";
import PaginationButton from "@/components/PaginationButton";
import Sorting from "@/components/Sorting";
import { totalSizeinSpace } from "@/lib/utils";

async function page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; query?: string; page?: string }>;
}) {
  const { slug } = await params;
  const { sort, query, page } = await searchParams;
  const res = await getFiles({ type: slug, sort, query, page });
  const { documents: data, total } = res!;
  const size = (data && totalSizeinSpace(data)) || 0;
  return (
    <div className="pt-8 bg-blue-50 h-[calc(100vh_-_64px)] rounded-4xl">
      <div className="px-16 space-y-4">
        <h1 className="text-4xl font-bold">
          {slug[0].toUpperCase() + slug.slice(1)}
        </h1>
        <div className="flex justify-between items-center">
          <p className="text-xs">Total Size: {size}</p>
          <div className="flex gap-3 items-center justify-start">
            <Sorting />
          </div>
        </div>
      </div>
      <div className="mt-8 px-10 overflow-y-scroll scroll-smooth max-h-[calc(100vh_-_250px)]">
        <div className="gap-5 grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-start">
          {data && data.map((file) => <FileCard key={file.$id} file={file} />)}
        </div>
        <PaginationButton total={total} />
      </div>
    </div>
  );
}

export default page;
