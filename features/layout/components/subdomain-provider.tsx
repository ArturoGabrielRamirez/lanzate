"use client"

import { useNextStep } from "nextstepjs";
import { useEffect, useState } from "react";

type Props = {
    adminLayout: React.ReactNode
    userLayout: React.ReactNode
}

function SubdomainProvider({ adminLayout, userLayout }: Props) {

    const [hasSubdomain, setHasSubdomain] = useState(false)
    const { startNextStep } = useNextStep();

    useEffect(() => {
        const subdomain = getSubdomainRegex(window.location.href)
        setHasSubdomain(subdomain !== null)
        startNextStep("mainTour");
    }, [])

    function getSubdomainRegex(url: string) {
        try {
            const { hostname } = new URL(url);

            const parts = hostname.split('.');

            if (parts.length >= 3) {
                const subdomain = parts[0];

                if (subdomain === 'www') {
                    return null;
                }
                return subdomain;
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