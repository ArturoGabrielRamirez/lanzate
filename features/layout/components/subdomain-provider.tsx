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
        const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\.]+)\./);
        return match ? match[1] : null;
    }

    return (
        <>
            {!hasSubdomain ? adminLayout : userLayout}
        </>
    )
}
export default SubdomainProvider