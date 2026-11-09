"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import text from "@/content/text.json";

export function ImageLightboxDialog({ src, alt }: { src: string; alt: string }) {
  return (
    <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-zinc-950/90" />
        <Dialog.Content aria-describedby={undefined} className="fixed inset-0 z-[90] flex items-center justify-center p-6 outline-none">
          <Dialog.Title className="sr-only">{text.post.openImage}</Dialog.Title>
          <Dialog.Close asChild><button type="button" aria-label={text.post.closeImage} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><X aria-hidden="true" /></button></Dialog.Close>
          <img src={src} alt={alt} className="max-h-full max-w-full rounded-xl object-contain" />
        </Dialog.Content>
    </Dialog.Portal>
  );
}

export function ImageLightbox({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return <Dialog.Root><Dialog.Trigger asChild><button type="button" aria-label={text.post.openImage} className="block w-full rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4"><img src={src} alt={alt} className={className} /></button></Dialog.Trigger><ImageLightboxDialog src={src} alt={alt} /></Dialog.Root>;
}
