"use client"

import { Menu } from "lucide-react";

import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button";

function HamburguerIcon() {
    return (
        <IconButton
            className="md:hidden"
            icon={Menu}
        />
    )
}

export { HamburguerIcon };