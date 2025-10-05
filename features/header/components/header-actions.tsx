import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const HeaderActions = () => {
  return (
    <div className="hidden md:flex items-center gap-3">
      <Button variant="ghost" asChild>
        <Link href="/saber-mas">Saber más</Link>
      </Button>
      <Button asChild>
        <Link href="/acceder">Acceder</Link>
      </Button>
    </div>
  );
};
