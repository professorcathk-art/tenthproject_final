export const PUBLIC_INSPIRATION_SLUGS = ["calai", "stealthwriter", "image-prompt-org"] as const;

export function isPublicInspirationSlug(slug: string) {
  return (PUBLIC_INSPIRATION_SLUGS as readonly string[]).includes(slug);
}
