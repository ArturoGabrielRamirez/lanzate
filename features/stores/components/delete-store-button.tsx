'use client';

import { Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from "@/features/global/components/button/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/features/shadcn/components/ui/dialog';
import { deleteStoreAction } from '@/features/stores/actions';
import type { DeleteStoreButtonProps } from '@/features/stores/types';

/**
 * DeleteStoreButton Component
 *
 * A button that opens a confirmation dialog to delete a store.
 * Uses React's useTransition for pending state management.
 * Includes toast notifications and redirects to the stores list
 * after successful deletion.
 *
 * @example
 * ```tsx
 * <DeleteStoreButton store={store} />
 * ```
 */
export function DeleteStoreButton({ store }: DeleteStoreButtonProps) {
  const t = useTranslations('store.delete');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      toast.loading(t('messages.loading'), { id: 'delete-store' });

      try {
        const result = await deleteStoreAction(store.id);

        if (result.hasError) {
          toast.error(result.message || t('messages.error'), { id: 'delete-store' });
          return;
        }

        toast.success(t('messages.success'), { id: 'delete-store' });
        setOpen(false);
        router.push('/stores');
      } catch (error) {
        console.error('Error deleting store:', error);
        toast.error(t('messages.error'), { id: 'delete-store' });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          {t('button')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dialog.title')}</DialogTitle>
          <DialogDescription>
            {t('dialog.description', { storeName: store.name })}
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {t('dialog.warning')}
        </p>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {t('dialog.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('messages.loading')}
              </>
            ) : (
              t('dialog.confirm')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
