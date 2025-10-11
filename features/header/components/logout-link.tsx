"use client";

import { toast } from "sonner";

import { logoutAction } from "@/features/auth/shared/actions";
import { Link } from "@/i18n/navigation";

function LogoutLink() {

    const handleLogoutClick = async () => {
        const res = await logoutAction();
        if (res.hasError) {
            toast.error("Failed to logout");
            return;
        }
    }

    return (
        <Link href="#" onClick={handleLogoutClick}>Sign out</Link>
    )
}

export { LogoutLink };