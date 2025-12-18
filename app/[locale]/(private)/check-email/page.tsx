import CheckEmail from "@/features/auth/components/change-status/check-email"
import { CheckEmailPageProps } from "@/features/auth/types"

export default async function CheckEmailPage({
    searchParams
}: CheckEmailPageProps) {
    const resolvedSearchParams = await searchParams;
    const email = resolvedSearchParams.email;
    const type = resolvedSearchParams.type || 'signup';


    return (
        <div>
            <CheckEmail email={email} type={type} />
        </div>
    );
}