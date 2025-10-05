import Link from 'next/link';
import { Rocket } from 'lucide-react';

export const HeaderLogo = () => {
  return (
    <Link href="/#inicio" className="flex items-center gap-2 group">
      <Rocket className="w-6 h-6 md:w-7 md:h-7 text-primary transition-transform group-hover:scale-110" />
      <span className="hidden md:inline-block text-xl font-bold text-foreground">Lanzate</span>
    </Link>
  );
};
