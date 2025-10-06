'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Empty, EmptyIcon, EmptyTitle, EmptyDescription, EmptyActions } from '@/components/ui/empty';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

interface NotFoundContentProps {
  title: string;
  description: string;
  goHome: string;
  goBack: string;
}

export const NotFoundContent = ({ title, description, goHome, goBack }: NotFoundContentProps) => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <Empty>
        <EmptyIcon>
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
        </EmptyIcon>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>
          {description}
        </EmptyDescription>
        <EmptyActions>
          <Button asChild variant="default">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              {goHome}
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {goBack}
          </Button>
        </EmptyActions>
      </Empty>
    </div>
  );
};

