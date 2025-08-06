import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmailChangeMonitor } from "./index";
import { EmailChangeDialogProps } from "../types";

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
                    <DialogTitle>Monitor de Cambio de Email</DialogTitle>
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