import { useTranslations } from "next-intl";

export default function CheckEmail() {

    const t = useTranslations("auth.check-email");

    return (
        <div className="p-8 text-center grow --color-background text-white flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">{t("message-1")}</h2>
            <p>{t("message-2")}</p>
        </div>
    )
}