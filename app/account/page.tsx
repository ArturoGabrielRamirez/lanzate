import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserInfo } from "@/features/layout/actions/getUserInfo";
import Title from "@/features/layout/components/title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link";

export default async function AccountPage() {

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()
    console.log("🚀 ~ AccountPage ~ user:", user)

    if (userError || !user) {
        return console.error(userMessage)
    }

    return (
        <div className="p-4 grow flex flex-col">
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
            <section className="py-4 grow flex">
                <Tabs defaultValue="account" className="grid grid-cols-1 md:grid-cols-[300px_1fr] grid-rows-[auto_1fr] md:grid-rows-[1fr] w-full md:gap-4">
                    <TabsList className="w-full h-full items-start">
                        <div className="flex md:block w-full">
                            <TabsTrigger value="account" className="w-full h-fit">Account Details</TabsTrigger>
                            <TabsTrigger value="password" className="w-full h-fit">Membership</TabsTrigger>
                        </div>
                    </TabsList>
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Details</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 w-fit">
                                <div className="flex flex-col">
                                    <p className="font-light text-sm">First Name</p>
                                    <p className="font-medium">{user.first_name || "No set"}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-light text-sm">Last Name</p>
                                    <p className="font-medium">{user.last_name || "No set"}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-light text-sm">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-light text-sm">Password</p>
                                    <Link href="/account/password" className="font-medium">Change Password</Link>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="password">Change your password here.</TabsContent>
                </Tabs>
            </section>

        </div>
    );
}