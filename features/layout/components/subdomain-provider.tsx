"use client"

import { useEffect, useState } from "react";

type Props = {
    adminLayout: React.ReactNode
    userLayout: React.ReactNode
}

function SubdomainProvider({ adminLayout, userLayout }: Props) {

    const [hasSubdomain, setHasSubdomain] = useState(false)
    console.log("🚀 ~ SubdomainProvider ~ hasSubdomain:", hasSubdomain)

    useEffect(() => {
        const subdomain = getSubdomainRegex(window.location.href)
        console.log("🚀 ~ useEffect ~ subdomain:", subdomain)
        setHasSubdomain(subdomain !== null)
    }, [])

    function getSubdomainRegex(url: string) {
        try {
            const { hostname } = new URL(url);
            console.log("🚀 ~ getSubdomainRegex ~ new URL(url):", new URL(url))
            console.log("🚀 ~ getSubdomainRegex ~ hostname:", hostname) //localhost.com
            const parts = hostname.split('.');
            // Si hay al menos 3 partes, hay subdominio (ej: sub.localhost.com)
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