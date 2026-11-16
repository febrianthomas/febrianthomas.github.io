import { MAX_POST_BODY_LENGTH, MAX_POST_TAG_LENGTH, MAX_POST_TAGS } from "../constants/post.ts";
import { postImageExtension } from "./post-image.ts";
import { hasYoutubeVideo } from "./youtube.ts";

const UUID_PATTERN = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

export function isValidUuid(value: string | null): value is string {
  return Boolean(value && UUID_PATTERN.test(value));
}

export function parsePostTags(raw: string): string[] {
  return [
    ...new Set(
      raw
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

export function arePostTagsValid(tags: string[]): boolean {
  return tags.length <= MAX_POST_TAGS && tags.every((tag) => tag.length <= MAX_POST_TAG_LENGTH);
}

export type PostFormValidationError = "tagsInvalid" | "requiredFields" | "bodyTooLong" | "imageInvalid";

export function validatePostInput(input: {
  title: string;
  description: string;
  body: string;
  plainText: string;
  tags: string[];
  checkBodyLength: boolean;
  image: File | null;
}): PostFormValidationError | null {
  if (!arePostTagsValid(input.tags)) return "tagsInvalid";
  if (!input.title || !input.description || (!input.plainText.trim() && !hasYoutubeVideo(input.body))) {
    return "requiredFields";
  }
  if (input.checkBodyLength && input.body.length > MAX_POST_BODY_LENGTH) return "bodyTooLong";
  if (input.image && !postImageExtension(input.image)) return "imageInvalid";
  return null;
}
