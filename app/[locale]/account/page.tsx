import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserInfo } from "@/features/layout/actions/getUserInfo";
import { Title } from "@/features/layout/components";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { User } from "lucide-react";
import ChangePasswordButton from "@/features/auth/components/changue-password-button";
import { EmailStatusBanner } from "@/features/auth/components/email-status-banner";
import ChangeEmailButton from "@/features/auth/components/changue-email-button";
import { EmailConfirmationDetector } from "@/features/auth/components/email-confirmation-detector";



export default async function AccountPage() {

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    const t = await getTranslations("account");

    if (userError || !user) {
        return console.error(userMessage)
    }

    return (
        <div className="p-4 grow flex flex-col pt-17">
            {/* Detector de confirmaciones de email */}
            <EmailConfirmationDetector />
            
            <Title title={(
                <div className="flex items-center gap-2">
                    <User />
                    {t("title")}
                </div>
            )} breadcrumbs={[
                {
                    label: t("title"),
                    href: "/account"
                }
            ]} showDate />
            
            {/* Banner de estado del email */}
            <EmailStatusBanner />
            
            <section className="flex items-center gap-4">
                <Card className="w-full">
                    <CardContent className="flex items-center gap-4 w-full">
                        <img
                            src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.email}`}
                            alt="User avatar"
                            className="size-24 rounded-full"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-bold">{user.email}</p>
                            <div>
                                <p className="capitalize">
                                    {user.Account[0].type.toLowerCase()} {t("title")}
                                </p>
                                {user.Account[0].type === "FREE" && (
                                    <Button asChild size="sm">
                                        <Link href="/upgrade">
                                            {t("description.upgrade-plan")}
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </section>
            <section className="py-4 grow flex">
                <Tabs defaultValue="account" className="grid grid-cols-1 md:grid-cols-[300px_1fr] grid-rows-[auto_1fr] md:grid-rows-[1fr] w-full md:gap-4">
                    <TabsList className="w-full h-full items-start">
                        <div className="flex md:block w-full">
                            <TabsTrigger value="account" className="w-full h-fit cursor-pointer py-3">{t("description.account-details")}</TabsTrigger>
                            <TabsTrigger value="password" className="w-full h-fit cursor-pointer py-3">{t("description.membership")}</TabsTrigger>
                        </div>
                    </TabsList>
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("description.account-details")}</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 w-fit">
                                <div className="flex flex-col">
                                    <p className="font-light text-sm">{t("description.first-name")}</p>
                                    <p className="font-medium">{user.first_name || "No set"}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-light text-sm">{t("description.last-name")}</p>
                                    <p className="font-medium">{user.last_name || "No set"}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-light text-sm">{t("description.email")}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">{user.email}</p>
                                        <ChangeEmailButton
                                            buttonText="Cambiar"
                                            title={t("description.change-email") || "Cambiar email"}
                                            currentEmail={user.email}
                                            className="font-medium text-xs h-6 px-2"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-light text-sm">{t("description.password")}</p>
                                    <ChangePasswordButton
                                        buttonText={t("description.change-password")}
                                        title={t("description.change-password")}
                                        className="font-medium justify-start p-0 h-auto text-foreground"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="password">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("description.membership")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {t("description.currently-not-available")}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </section>
        </div>
    );
}