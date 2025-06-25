import { formatFileSize } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { UploadToastThumbanil } from "./Thumbnail";

export function UploadToast({ file }: { file: File }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Slowly increment until 95%
        if (prev < 95) return prev + Math.random() * 5;
        return prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg w-80 border border-gray-200 flex items-start gap-4 mt-2">
      <UploadToastThumbanil file={file} />

      <div className="flex-1">
        <div className="font-medium text-sm text-gray-800 leading-tight line-clamp-1">
          {file.name}
        </div>

        <div className="text-xs text-gray-500 mb-2">
          {formatFileSize(file.size)}
        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <Progress value={progress} color="#60a5fa" />
        </div>

        <div className="text-[11px] text-gray-400 mt-1">Uploading...</div>
      </div>
    </div>
  );
}

export default UploadToast;
