import { FileText } from "lucide-react";
import Image from "next/image";
import { postImageUrl } from "@/lib/posts";

export function PostThumbnail({
  imagePath,
  sizes,
  className = "",
}: {
  imagePath: string | null;
  sizes: string;
  className?: string;
}) {
  return (
    <div
      className={`flex aspect-4/3 items-center justify-center overflow-hidden bg-orange-100 text-orange-700 dark:bg-zinc-800 dark:text-orange-300 ${className}`}
    >
      {imagePath ? (
        <Image
          src={postImageUrl(imagePath)}
          alt=""
          width={600}
          height={450}
          className="size-full object-cover"
          sizes={sizes}
        />
      ) : (
        <FileText size={48} aria-hidden="true" />
      )}
    </div>
  );
}
