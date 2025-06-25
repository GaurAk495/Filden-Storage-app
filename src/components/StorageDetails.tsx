import { storageStatistic } from "@/action/fileStorage.action";
import { categories } from "@/lib/utils";
import Link from "next/link";

function formatSize(mb: number): string {
  return mb >= 1024
    ? `${(mb / 1024).toFixed(2)} GB`
    : `${parseFloat(mb.toFixed(2))} MB`;
}

async function StorageDetails() {
  const { success, message, usedMB } = await storageStatistic();
  if (!success) {
    return <div>{message}</div>;
  }
  if (!usedMB) return;
  const MAX_STORAGE_MB = 1024;
  const usedPercent = (Number(usedMB.total) / MAX_STORAGE_MB) * 100;
  return (
    <div className="space-y-6 rounded-4xl">
      <div className="rounded-4xl bg-red-400 text-white p-6 shadow-md text-center">
        <div className="text-3xl font-bold">{usedPercent.toFixed(2)}%</div>
        <div className="text-sm mb-2">Space used</div>
        <div className="text-md font-semibold">
          Available Storage {formatSize(Number(usedMB.total))} /{" "}
          {formatSize(MAX_STORAGE_MB)}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {categories.map(({ label, key, icon, color }) => {
          const mb = parseFloat(usedMB[key]);
          return (
            <Link href={`/${label.toLowerCase()}`} key={key}>
              <div className="rounded-xl bg-white shadow-sm p-4 flex flex-col items-center text-center hover:scale-105 duration-150 hover:shadow">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${color}`}
                >
                  <span className="text-xl">{icon}</span>
                </div>
                <div className="mt-2 font-semibold">{label}</div>
                <div className="text-sm text-gray-600">{formatSize(mb)}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Last update
                  <br />
                  10:15am, 10 Oct
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default StorageDetails;

// title: 'string',
// type: 'image' | 'video' | 'pdf' | 'song' | 'document' | 'other'
// file_extension: 'jpg',
// size: 169046,
