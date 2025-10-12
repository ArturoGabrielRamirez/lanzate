"use client";

import { toast } from "sonner";

import { handleSignOut } from "@/features/auth/actions";
import { Link } from "@/i18n/naviation";

function LogoutLink() {

    const handleLogoutClick = async () => {
        const res = await handleSignOut()
        if (res.error) {
            toast.error("Failed to logout");
            return;
        }
    }

    return (
        <Link href="#" onClick={handleLogoutClick}>Sign out</Link>
    )
}

export { LogoutLink };