"use client"

import { useEffect, useState } from "react";

type Props = {
    adminLayout: React.ReactNode
    userLayout: React.ReactNode
}

function SubdomainProvider({ adminLayout, userLayout }: Props) {

    const [hasSubdomain, setHasSubdomain] = useState(false)

    useEffect(() => {
        const subdomain = getSubdomainRegex(window.location.href)
        setHasSubdomain(subdomain !== null)
    }, [])

    function getSubdomainRegex(url: string) {
        try {
            const { hostname } = new URL(url);

            const parts = hostname.split('.');

            if (parts.length >= 3) {
                return parts[0];
            }
            return null;
        } catch {
            return null;
        }
    }

    return (
        <>
            {!hasSubdomain ? adminLayout : userLayout}
        </>
    )
}
export default SubdomainProvider