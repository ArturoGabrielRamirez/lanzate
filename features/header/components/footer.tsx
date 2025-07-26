import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

function Footer() {

    const t = useTranslations('home');

    return (
        <footer className="p-6 relative">
            <div className="container grid grid-cols-2 mx-auto gap-x-3 gap-y-8 sm:grid-cols-3 md:grid-cols-4 justify-items-center text-center">
                <div className="flex flex-col space-y-4">
                    <h2 className="font-medium">{t('footer.getting-started.title')}</h2>
                    <div className="flex flex-col space-y-2 text-sm dark:text-gray-600">
                        <a rel="noopener noreferrer" href="#">{t('footer.getting-started.links.1')}</a>
                        <a rel="noopener noreferrer" href="#">{t('footer.getting-started.links.2')}</a>
                        <a rel="noopener noreferrer" href="#">{t('footer.getting-started.links.3')}</a>
                        <a rel="noopener noreferrer" href="#">{t('footer.getting-started.links.4')}</a>
                        <a rel="noopener noreferrer" href="#">{t('footer.getting-started.links.5')}</a>
                        <a rel="noopener noreferrer" href="#">{t('footer.getting-started.links.6')}</a>
                        <a rel="noopener noreferrer" href="#">{t('footer.getting-started.links.7')}</a>
                    </div>
                </div>
                <div className="flex flex-col space-y-4">
                    <h2 className="font-medium">{t('footer.core-concepts.title')}</h2>
                    <div className="flex flex-col space-y-2 text-sm dark:text-gray-600">
                        <a rel="noopener noreferrer" href="#">{t('footer.core-concepts.links.1')}</a>
                        <a rel="noopener noreferrer" href="#">{t('footer.core-concepts.links.2')}</a>
                        <a rel="noopener noreferrer" href="#">{t('footer.core-concepts.links.3')}</a>
                        <a rel="noopener noreferrer" href="#">{t('footer.core-concepts.links.4')}</a>
                        <a rel="noopener noreferrer" href="#">{t('footer.core-concepts.links.5')}</a>
                        <a rel="noopener noreferrer" href="#">{t('footer.core-concepts.links.6')}</a>
                        <a rel="noopener noreferrer" href="#">{t('footer.core-concepts.links.7')}</a>
                    </div>
                </div>
                <div className="flex flex-col space-y-4">
                    <h2 className="font-medium">{t('footer.customization.title')}</h2>
                    <div className="flex flex-col space-y-2 text-sm dark:text-gray-600">
                        <a rel="noopener noreferrer" href="#">{t('footer.customization.links.1')}</a>
                        <a rel="noopener noreferrer" href="#">{t('footer.customization.links.2')}</a>
                        <a rel="noopener noreferrer" href="#">{t('footer.customization.links.3')}</a>
                        <a rel="noopener noreferrer" href="#">{t('footer.customization.links.4')}</a>
                        <a rel="noopener noreferrer" href="#">{t('footer.customization.links.5')}</a>
                        <a rel="noopener noreferrer" href="#">{t('footer.customization.links.6')}</a>
                        <a rel="noopener noreferrer" href="#">{t('footer.customization.links.7')}</a>
                    </div>
                </div>
                <div className="flex flex-col space-y-4">
                    <h2 className="font-medium">{t('footer.community.title')}</h2>
                    <div className="flex flex-col space-y-2 text-sm dark:text-gray-600">
                        <a rel="noopener noreferrer" href="#">GitHub</a>
                        <a rel="noopener noreferrer" href="#">Discord</a>
                        <a rel="noopener noreferrer" href="#">Twitter</a>
                        <a rel="noopener noreferrer" href="#">YouTube</a>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center px-6 pt-12 text-sm">
                <span className="dark:text-gray-600">{t('footer.copyright')}</span>
            </div>
            <DotPattern
                width={30}
                height={30}
                className={cn(
                    "[mask-image:linear-gradient(to_top,white,transparent_70%,transparent)] ",
                )}
            />
        </footer>
    )
}
export default Footer