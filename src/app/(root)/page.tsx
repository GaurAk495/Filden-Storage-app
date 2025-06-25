import { recentFiles } from "@/action/fileStorage.action";
import RecentFilesItems from "@/components/RecentFilesItems";
import StorageDetails from "@/components/StorageDetails";

async function page() {
  const data = await recentFiles();
  return (
    <div className="pt-6 sm:pt-8 bg-blue-50 min-h-[calc(100vh-64px)] rounded-3xl sm:rounded-4xl px-2 sm:px-4 md:px-8 gap-4 sm:gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        <StorageDetails />
        <div className="bg-white p-4 sm:p-8 rounded-3xl sm:rounded-4xl h-[calc(100vh_-_150px)] flex flex-col">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
            Recent File Uploaded
          </h3>
          <div className="overflow-y-scroll space-y-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50 pr-2 h-[calc(100vh_-_180px)]">
            {data.map((file) => (
              <RecentFilesItems file={file} key={file.$id} />
            ))}
            {data.length === 0 && (
              <div className="text-red-400 text-center">No Recent Files</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
