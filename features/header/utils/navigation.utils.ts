export const isActiveRoute = (pathname: string, href: string): boolean => {
    const normalize = (s: string) => s.replace(/\/+$/, '') || '/';

    const path = normalize(pathname);
    const target = normalize(href);

    if (target === '/') return path === '/';

    return path === target || path.startsWith(`${target}/`);
};