"use client"

import { useEffect, useState } from "react";

import { SubdomainProviderProps } from "@/features/layout/types/types";
import { getSubdomainRegex } from "@/features/layout/utils/get-subdomain-regex";

function SubdomainProvider({ adminLayout, userLayout }: SubdomainProviderProps) {

    const [hasSubdomain, setHasSubdomain] = useState(false)

    useEffect(() => {
        const subdomain = getSubdomainRegex(window.location.href)
        setHasSubdomain(subdomain !== null)
    }, [])

    return (
        <>
            {!hasSubdomain ? adminLayout : userLayout}
        </>
    )
}
export { SubdomainProvider }