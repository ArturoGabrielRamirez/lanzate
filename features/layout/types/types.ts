import type { ChatMessage } from "@/hooks/use-realtime-chat"

import type { ReactNode } from "react"


export type ChatState = {
    roomId: string
    isMaximized: boolean
    messages: ChatMessage[]
    isLoading: boolean
    isOrderCompleted: boolean
    username: string
    messageType: "STORE_TO_CUSTOMER" | "CUSTOMER_TO_STORE"
}

export type ChatProviderProps = {
    children: ReactNode
}

export type SubdomainProviderProps = {
    adminLayout: ReactNode
    userLayout: ReactNode
}

export type MainContainerProps = {
    children: ReactNode
}

export type SectionContainerProps = {
    children: ReactNode
    className?: string
}

export type StoreProviderProps = {
    children: ReactNode
}

export type SocialMediaLinks = {
    facebook_url?: string | null
    instagram_url?: string | null
    x_url?: string | null
}

export type HeaderProps = {
    title?: string
    socialMedia?: SocialMediaLinks | null
    showSocialLinks?: boolean
    logo?: string | null
}

export type FooterProps = {
    title?: string
    socialMedia?: SocialMediaLinks | null
    showSocialLinks?: boolean
}


