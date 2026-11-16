export const POST_IMAGES_BUCKET = "post-images";
export const MAX_POST_IMAGE_SIZE = 5 * 1024 * 1024;
export const MAX_POST_BODY_LENGTH = 20000;
export const MAX_POST_TAGS = 10;
export const MAX_POST_TAG_LENGTH = 40;
export const MAX_INLINE_IMAGES = 20;

export const ACCEPTED_IMAGE_MIME_TYPES = "image/jpeg,image/png,image/webp,image/gif";

export const ALLOWED_MARKDOWN_ELEMENTS = [
  "p",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "blockquote",
  "h2",
  "br",
  "a",
];

export const SUPPORT_BUTTON_IDS = ["streamlabs", "saweria", "kofi", "trakteer"] as const;
export type SupportButtonId = (typeof SUPPORT_BUTTON_IDS)[number];
