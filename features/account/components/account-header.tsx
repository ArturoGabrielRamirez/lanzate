import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProfileEditor } from "@/features/auth/components/profile/profile-editor"

import { AccountHeaderProps } from "../types"
import { UserType } from "../types"
import AvatarEditor from "./avatar-editor"

function getDisplayName(user: UserType): string {
    if (user.username?.trim()) {
        return user.username
    }
    const firstName = user.first_name?.trim()
    const lastName = user.last_name?.trim()
    if (firstName || lastName) {
        return [firstName, lastName].filter(Boolean).join(' ')
    }
    return user.email
}

export default function AccountHeader({ user, translations: t, onAvatarUpdate, onProfileUpdate }: AccountHeaderProps) {
    return (
        <section className="flex items-center gap-4">
            <Card className="w-full">
                <CardContent className="flex items-center gap-4 w-full">
                    <div className="relative">
                        <img
                            src={user.avatar ? user.avatar : `https://api.dicebear.com/9.x/initials/svg?seed=${user.email}`}
                            alt="User avatar"
                            className="size-24 rounded-full object-cover bg-chart-4 ring-1 ring-primary"
                        />
                        <AvatarEditor
                            currentAvatar={user.avatar}
                            userEmail={user.email}
                            onAvatarUpdate={onAvatarUpdate}
                        />
                    </div>
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-xl font-bold truncate">
                                {getDisplayName(user)}
                            </h2>
                            <ProfileEditor
                                currentUsername={user.username}
                                currentFirstName={user.first_name}
                                currentLastName={user.last_name}
                                currentPhone={user.phone}
                                onProfileUpdate={onProfileUpdate}
                            />
                        </div>
                        <div className="flex flex-col items-start gap-2 pl-2">
                            <p className="capitalize text-sm">
                                {user.Account[0].type.toLowerCase()} {t.title}
                            </p>
                            {user.Account[0].type === "FREE" && (
                                <Button asChild size="sm" className="bg-gradient-to-b from-primary/95 to-chart-5/65 text-white hover:from-primary/100 hover:to-chart-5/90">
                                    <Link href="/upgrade">
                                        {t["description.upgrade-plan"]}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}