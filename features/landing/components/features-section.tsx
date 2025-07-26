import { useTranslations } from "next-intl";

function FeaturesSection() {

    const t = useTranslations('home');

    return (
        <section className="p-6">
            <div className="container mx-auto">
                <span className="block mb-2 text-xs font-medium tracking-widest text-center uppercase text-accent">{t('description.how-it-work.title')}</span>
                <h2 className="text-5xl font-bold text-center">{t('description.how-it-work.description')}</h2>
                <div className="grid gap-6 my-16 lg:grid-cols-3">
                    <div className="flex flex-col p-8 space-y-4 rounded-md bg-primary text-primary-foreground">
                        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-accent ">1</div>
                        <p className="text-2xl font-semibold">
                            <b>{t('description.centralize.title')}</b> {t('description.centralize.description')}
                        </p>
                    </div>
                    <div className="flex flex-col p-8 space-y-4 rounded-md bg-primary text-primary-foreground">
                        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-accent ">2</div>
                        <p className="text-2xl font-semibold">
                            <b>{t('description.sell.title')} &amp; {t('description.sell.title-2')}</b> {t('description.sell.description')}
                        </p>
                    </div>
                    <div className="flex flex-col p-8 space-y-4 rounded-md bg-primary text-primary-foreground">
                        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-accent ">3</div>
                        <p className="text-2xl font-semibold">
                            <b>{t('description.ship-easily.title')}</b> {t('description.ship-easily.description')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default FeaturesSection