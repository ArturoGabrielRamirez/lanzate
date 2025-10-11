import { useTranslations } from "next-intl";

function Footer() {
    const t = useTranslations("home.footer");

    return (
        <footer id="contact" className="bg-muted/50 border-t border-border py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Lanzate
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Gestiona tu negocio online nunca fue tan fácil. Enfocate en crecer mientras te damos el control total.
                        </p>
                    </div>

                    {/* Getting Started */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">
                            {t("getting-started.title")}
                        </h4>
                        <ul className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <li key={i}>
                                    <a
                                        href="#"
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {t(`getting-started.links.${i}`)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Core Concepts */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">
                            {t("core-concepts.title")}
                        </h4>
                        <ul className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <li key={i}>
                                    <a
                                        href="#"
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {t(`core-concepts.links.${i}`)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customization */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">
                            {t("customization.title")}
                        </h4>
                        <ul className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <li key={i}>
                                    <a
                                        href="#"
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {t(`customization.links.${i}`)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-border">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            {t("copyright")}
                        </p>
                        <div className="flex gap-6">
                            <a
                                href="#"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {t("links.1")}
                            </a>
                            <a
                                href="#"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {t("links.2")}
                            </a>
                            <a
                                href="#"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {t("links.3")}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export { Footer };