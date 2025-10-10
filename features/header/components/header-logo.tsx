import { Rocket } from 'lucide-react';
import Link from 'next/link';

function HeaderLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <Rocket className="size-6 md:size-7 text-primary-foreground dark:text-primary transition-transform group-hover:scale-110" />
      <span className="hidden md:inline-block text-xl font-bold text-primary-foreground">Lanzate</span>
    </Link>
  );
};

export { HeaderLogo };