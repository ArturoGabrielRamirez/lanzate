import { Footer } from "@/features/footer/components";
import { PublicHeader } from "@/features/header/components";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <PublicHeader />
            {children}
            <Footer />
        </>
    );
}
