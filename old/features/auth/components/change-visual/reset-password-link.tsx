import { useTranslations } from "next-intl";
import Link from "next/link";

const ResetPasswordLink = () => {

    const t = useTranslations("auth.reset-password.description");

    return (
        <div className="flex flex-col items-center justify-center w-full p-4">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">
                {t("forgot-password")}{" "}
            </h3>
            <Link
                href="/reset-password"
                className="text-sm text-blue-500 hover:underline"
            >
                {t("reset-password")}
            </Link>

        </div>
    );
}

export default ResetPasswordLink;