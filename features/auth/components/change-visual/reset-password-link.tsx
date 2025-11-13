import Link from "next/link"
import { useTranslations } from "next-intl"

function ResetPasswordLink() {

    const t = useTranslations("auth.login.resetPassword")

    return (
        <div className="flex gap-2 items-center justify-center w-full">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">
                {t("question")}{" "}
            </h3>
            <Link href="/reset-password" className="text-sm text-blue-500 hover:underline">
                {t("link")}
            </Link>
        </div>
    )
}

export { ResetPasswordLink };