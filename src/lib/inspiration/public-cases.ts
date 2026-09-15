export const PUBLIC_INSPIRATION_SLUGS = ["calai", "stealthwriter", "image-prompt-org"] as const;

export function isPublicInspirationSlug(slug: string) {
  return (PUBLIC_INSPIRATION_SLUGS as readonly string[]).includes(slug);
}

export function sortInspirationCases<T extends { slug: string }>(
  studies: T[],
  options?: { readSlugs?: Iterable<string> },
): T[] {
  const read = new Set(options?.readSlugs ?? []);
  const pinOrder = new Map<string, number>(PUBLIC_INSPIRATION_SLUGS.map((slug, index) => [slug, index]));
  return studies
    .map((study, index) => ({ study, index }))
    .sort((a, b) => {
      const aRead = read.has(a.study.slug) ? 1 : 0;
      const bRead = read.has(b.study.slug) ? 1 : 0;
      if (aRead !== bRead) return aRead - bRead;
      const aPin = pinOrder.has(a.study.slug) ? 0 : 1;
      const bPin = pinOrder.has(b.study.slug) ? 0 : 1;
      if (aPin !== bPin) return aPin - bPin;
      const aOrder = pinOrder.get(a.study.slug) ?? 99;
      const bOrder = pinOrder.get(b.study.slug) ?? 99;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.index - b.index;
    })
    .map(({ study }) => study);
}
