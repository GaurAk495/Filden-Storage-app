import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import FileCardMenu from "./FileCardMenu";
import Link from "next/link";

function RecentFilesfiles({ file }: { file: Models.Document }) {
  return (
    <Link
      href={file.url}
      target="_blank"
      className="flex w-full pr-2 flex-row gap-2 cursor-pointer items-center justify-start"
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-[60px] h-[60px] rounded-full overflow-hidden">
        <Thumbnail file={file} size={40} />
      </div>

      {/* Title */}
      <div className="w-2/3 text-slate-700">
        <p className="flex-grow text-sm truncate">{file.title}</p>
      </div>
      <div className="ml-auto">
        <FileCardMenu file={file} />
      </div>
    </Link>
  );
}

export default RecentFilesfiles;
