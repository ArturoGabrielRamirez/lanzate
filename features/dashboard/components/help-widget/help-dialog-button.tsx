'use client';

import { useTranslations } from "next-intl";
import { useState } from 'react';


import { ContactForm } from "@/features/global/components/contact-us/contact-form";
import { Button } from "@/features/shadcn/components/button";
import { Dialog, DialogContent, DialogTrigger } from "@/features/shadcn/components/ui/dialog";



function HelpDialogButton() {
    const t = useTranslations("dashboard.help");
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    {t("send-message")}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-foreground">
                            {t("dialog.title")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("dialog.description")}
                        </p>
                    </div>
                    <ContactForm onSuccess={() => setOpen(false)} />
                </div>
            </DialogContent>
        </Dialog>)
}

export { HelpDialogButton };