'use client';

export const useSmoothScroll = (headerOffset: number = 80) => {
    const scrollToAnchor = (href: string) => {
        if (!href.includes('#')) return;
        const targetId = href.split('#')[1];
        const element = document.getElementById(targetId);
        if (!element) return;

        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    };

    return { scrollToAnchor };
};