import Link from "next/link";
import { useTranslations } from "next-intl";

function ResetPasswordLink() {

    const t = useTranslations("auth.reset-password.description");

    return (
        <div className="flex gap-2 items-center justify-center w-full">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">
                {t("forgot-password")}{" "}
            </h3>
            <Link href="/reset-password" className="text-sm text-blue-500 hover:underline">
                {t("reset-password")}
            </Link>

        </div>
    );
}

export { ResetPasswordLink };