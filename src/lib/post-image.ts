import { MAX_POST_IMAGE_SIZE } from "../constants/post.ts";

const imageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const maxPostImageSize = MAX_POST_IMAGE_SIZE;

export function createPostImagePath(file: Pick<File, "type">) {
  const extension = imageExtensions[file.type] ?? file.type.split("/")[1];
  return `${crypto.randomUUID()}.${extension}`;
}

export function postImageExtension(file: Pick<File, "type" | "size">) {
  if (file.size <= 0 || file.size > maxPostImageSize || !Object.hasOwn(imageExtensions, file.type)) return null;
  return imageExtensions[file.type];
}

async function mayBeAnimated(file: File) {
  if (file.type === "image/gif") return true;
  if (file.type === "image/jpeg") return false;
  const data = new DataView(await file.arrayBuffer());
  if (file.type === "image/webp") {
    if (data.byteLength < 21 || data.getUint32(0) !== 0x52494646 || data.getUint32(8) !== 0x57454250) return true;
    return data.getUint32(12) === 0x56503858 && (data.getUint8(20) & 2) !== 0;
  }
  if (file.type === "image/png") {
    if (data.byteLength < 8 || data.getUint32(0) !== 0x89504e47 || data.getUint32(4) !== 0x0d0a1a0a) return true;
    for (let offset = 8; offset + 12 <= data.byteLength;) {
      const length = data.getUint32(offset);
      const type = data.getUint32(offset + 4);
      if (length > data.byteLength - offset - 12) return true;
      if (type === 0x6163544c) return true; // APNG animation control
      if (type === 0x49444154) return false; // Image data starts after animation control.
      offset += 12 + length;
    }
  }
  return true;
}

async function optimizeGif(file: File): Promise<File> {
  if (typeof Worker === "undefined" || typeof Element === "undefined") return file;
  const { default: gifsicle } = await import("gifsicle-wasm-browser");
  const outputs = await gifsicle.run({
    input: [{ file, name: "input.gif" }],
    command: ["-O2 --lossy=60 --resize-fit 1600x1600 input.gif -o /out/output.gif"],
  });
  const out = outputs?.[0];
  if (!out || out.type !== "image/gif" || out.size === 0 || out.size >= file.size) return file;
  return new File([out], "post-image.gif", { type: out.type, lastModified: file.lastModified });
}

export async function optimizePostImage(file: File): Promise<File> {
  try {
    if (file.type === "image/gif") return await optimizeGif(file);
    if (await mayBeAnimated(file)) return file;
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Could not decode image"));
        image.src = url;
      });
      const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      if (!context) return file;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.82));
      if (!blob || blob.type !== "image/webp" || blob.size === 0 || blob.size >= file.size) return file;
      return new File([blob], "post-image.webp", { type: blob.type, lastModified: file.lastModified });
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch {
    return file;
  }
}
