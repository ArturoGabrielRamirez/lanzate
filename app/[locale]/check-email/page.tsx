import CheckEmail from "@/features/auth/components/check-email";

interface CheckEmailPageProps {
    searchParams: Promise<{ 
        email?: string;
        type?: 'signup' | 'recovery';
    }>;
}

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