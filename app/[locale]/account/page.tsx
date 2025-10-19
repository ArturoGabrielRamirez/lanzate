import { getTranslations } from "next-intl/server";

import { AccountPageClient } from "@/features/account/components";
import { getUserInfo } from "@/features/layout/actions/getUserInfo";


export default async function AccountPage() {
    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()
    const t = await getTranslations("account");

    if (userError || !user) {
        return console.error(userMessage)
    }

    const translations = {
        title: t("title"),
        "description.upgrade-plan": t("description.upgrade-plan"),
        "description.account-details": t("description.account-details"),
        "description.membership": t("description.membership"),
        "description.username": "Usuario",
        "description.first-name": t("description.first-name"),
        "description.last-name": t("description.last-name"),
        "description.email": t("description.email"),
        "description.password": t("description.password"),
        "description.change-email": t("description.change-email"),
        "description.change-password": t("description.change-password"),
        "description.currently-not-available": t("description.currently-not-available"),
        "description.phone": "Teléfono"
    }

    return <AccountPageClient user={user} translations={translations} />
}