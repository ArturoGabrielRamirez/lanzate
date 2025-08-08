import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmailChangeMonitor } from "./index";
import { EmailChangeDialogProps } from "../types";
import { Mail } from "lucide-react";

export default function EmailChangeDialog({
    showMonitor,
    onOpenChange,
    currentEmail,
    newEmail,
    onComplete
}: EmailChangeDialogProps) {
    return (
        <Dialog open={showMonitor} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex gap-2"><Mail className="w-5 h-5" />
                        Cambio de email</DialogTitle>
                </DialogHeader>
                <EmailChangeMonitor
                    onComplete={onComplete}
                    initialOldEmail={currentEmail}
                    newEmail={newEmail}
                />
            </DialogContent>
        </Dialog>
    );
}