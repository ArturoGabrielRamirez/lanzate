export const extractAnchorId = (href: string): string | null => {
  if (!href || !href.includes('#')) return null;
  const parts = href.split('#');
  return parts[1] || null;
};

export const scrollToAnchorWithOffset = (anchorId: string, headerOffset: number) => {
  const element = document.getElementById(anchorId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
};


