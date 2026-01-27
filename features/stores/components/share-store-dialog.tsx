"use client";

import { Copy, Check, Link } from "lucide-react";
import { toast } from "sonner";

import { useCopyToClipboard } from "@/features/global/hooks/use-copy-to-clipboard";
import { Button } from "@/features/shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/features/shadcn/components/ui/dialog";
import { Input } from "@/features/shadcn/components/ui/input";

interface ShareStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subdomain: string;
  storeName?: string;
}

/**
 * ShareStoreDialog - Dialog for sharing store URL
 *
 * Shows the public store URL and provides copy-to-clipboard functionality.
 */
export function ShareStoreDialog({
  open,
  onOpenChange,
  subdomain,
  storeName,
}: ShareStoreDialogProps) {
  const { copy, copied } = useCopyToClipboard();
  const storeUrl = `https://${subdomain}.lanzate.app`;

  const handleCopy = async () => {
    const success = await copy(storeUrl);
    if (success) {
      toast.success("URL copiada al portapapeles");
    } else {
      toast.error("No se pudo copiar la URL");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Compartir tienda
          </DialogTitle>
          <DialogDescription>
            {storeName
              ? `Comparte el enlace de ${storeName} con tus clientes`
              : "Comparte el enlace de tu tienda con tus clientes"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Input
            value={storeUrl}
            readOnly
            className="flex-1 font-mono text-sm"
          />
          <Button
            type="button"
            size="icon"
            variant={copied ? "default" : "outline"}
            onClick={handleCopy}
            className="shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copiar URL</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
