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
            {/* Debug temporal */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                backgroundColor: 'red',
                color: 'white',
                padding: '10px',
                zIndex: 9999,
                fontSize: '12px'
            }}>
                DEBUG PAGE: email = {email || 'undefined'} | type = {type}
            </div>
            
            <CheckEmail email={email} type={type} />
        </div>
    );
}