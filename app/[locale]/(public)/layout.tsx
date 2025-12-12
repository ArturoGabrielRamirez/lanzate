import { Footer } from "@/features/footer/components";
import { Header } from "@/features/header/components/public-header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}