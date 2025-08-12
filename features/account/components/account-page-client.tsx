'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Title } from "@/features/layout/components"
import { Calendar, Home, Store, User } from "lucide-react"
import { EmailStatusBanner } from "@/features/auth/components/index"
import { DotPattern } from "@/components/magicui/dot-pattern"
import { cn } from "@/lib/utils"
import { AccountHeader } from "./index"
import { AccountDetailsTab } from "./index"
import { AccountPageClientProps } from "../types"
import { UserType } from "../types/types"
import FloatingDock from "@/features/header/components/floating-dock"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AccountPageClient({ user: initialUser, translations: t }: AccountPageClientProps) {
    const [user, setUser] = useState<UserType>(initialUser)

    const handleAvatarUpdate = (newAvatarUrl: string | null) => {
        setUser(prevUser => ({
            ...prevUser,
            avatar: newAvatarUrl
        }))
    }

    const handleProfileUpdate = (profile: {
        username: string | null
        firstName: string | null
        lastName: string | null
    }) => {
        setUser(prevUser => ({
            ...prevUser,
            username: profile.username,
            first_name: profile.firstName,
            last_name: profile.lastName
        }))
    }

    return (
        <div className="p-4 grow flex flex-col pt-17 relative">
            <Title
                title={(
                    <div className="flex items-center gap-2">
                        <User />
                        {t.title}
                    </div>
                )}
                breadcrumbs={[
                    {
                        label: t.title,
                        href: "/account"
                    }
                ]}
                showDate
            />

            <EmailStatusBanner />

            <AccountHeader
                user={user}
                translations={t}
                onAvatarUpdate={handleAvatarUpdate}
                onProfileUpdate={handleProfileUpdate}
            />

            <section className="py-4 grow flex">
                <Tabs defaultValue="account" className="grid grid-cols-1 md:grid-cols-[300px_1fr] grid-rows-[auto_1fr] md:grid-rows-[1fr] w-full md:gap-4">
                    <TabsList className="w-full h-full items-start">
                        <div className="flex md:block w-full">
                            <TabsTrigger value="account" className="w-full h-fit cursor-pointer py-3">
                                {t["description.account-details"]}
                            </TabsTrigger>
                            <TabsTrigger value="password" className="w-full h-fit cursor-pointer py-3">
                                {t["description.membership"]}
                            </TabsTrigger>
                        </div>
                    </TabsList>

                    <TabsContent value="account">
                        <AccountDetailsTab user={user} translations={t} />
                    </TabsContent>

                    <TabsContent value="password">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t["description.membership"]}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {t["description.currently-not-available"]}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
                {/* <FloatingDock showBackButton /> */}
            </section>

            <DotPattern
                width={30}
                height={30}
                className={cn(
                    "[mask-image:linear-gradient(to_bottom_right,white,transparent_70%,transparent)] ",
                )}
            />
        </div>
    )
}