'use client';

import { useTranslations } from "next-intl";
import { useState } from 'react';

import { ContactForm } from "@/features/global/components/contact-us/contact-form";
import { Button } from "@/features/shadcn/components/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/features/shadcn/components/ui/dialog";

function HelpDialogButton({ asChild = false }: { asChild?: boolean }) {
    const t = useTranslations("dashboard.help");
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={asChild}>
                <Button variant="outline" className="w-full">
                    {t("send-message")}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {t("dialog.title")}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <p className="text-muted-foreground">
                        {t("dialog.description")}
                    </p>
                    <ContactForm onSuccess={() => setOpen(false)} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export { HelpDialogButton };