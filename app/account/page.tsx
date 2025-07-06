import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/features/layout/actions/getUserInfo";
import Title from "@/features/layout/components/title";
import Link from "next/link";

export default async function AccountPage() {

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()
    console.log("🚀 ~ AccountPage ~ user:", user)

    if (userError || !user) {
        return console.error(userMessage)
    }

    return (
        <div className="p-4">
            <Title title="Account" />
            <section className="flex items-center gap-4">
                <img
                    src="https://api.dicebear.com/9.x/initials/svg?seed=Felix"
                    alt="User avatar"
                    className="size-24 rounded-full"
                />
                <div className="flex flex-col gap-2">
                    <p className="text-xl font-bold">{user.email}</p>
                    <div>
                        <p className="capitalize">
                            {user.Account[0].type.toLowerCase()} account
                        </p>
                        {user.Account[0].type === "FREE" && (
                            <Button asChild size="sm">
                                <Link href="/upgrade">
                                    Upgrade Plan
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </section>

        </div>
    );
}