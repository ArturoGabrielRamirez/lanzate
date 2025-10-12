export const isActiveRoute = (pathname: string, href: string): boolean => {
    const stripLocale = (s: string) => s.replace(/^\/(es|en)(?=\/|$)/, '');
    const normalize = (s: string) => s.replace(/\/+$/, '') || '/';

    const path = normalize(stripLocale(pathname));
    const target = normalize(href);

    if (target === '/') return path === '/';

    return path === target || path.startsWith(`${target}/`);
};