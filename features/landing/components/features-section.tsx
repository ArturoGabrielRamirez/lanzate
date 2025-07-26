import * as motion from "motion/react-client"
import { useTranslations } from "next-intl";

function FeaturesSection() {

    const t = useTranslations('home');

    const variants = {
        hidden: { opacity: 0, y: 100, scale: 0.75 },
        visible: {
            opacity: 1, y: 0, scale: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 100, scale: 0.75 },
        visible: { opacity: 1, y: 0, scale: 1, }
    }

    return (
        <section className="p-6">
            <div className="container mx-auto">
                <motion.p
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="block mb-2 text-xs font-medium tracking-widest text-center uppercase text-accent"
                >
                    {t('description.how-it-work.title')}
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                    className="text-5xl font-bold text-center"
                >
                    {t('description.how-it-work.description')}
                </motion.h2>
                <motion.div className="grid gap-6 my-16 lg:grid-cols-3"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.15 }}
                    variants={variants}
                >
                    <motion.div className="flex flex-col p-8 space-y-4 rounded-md bg-primary text-primary-foreground"
                        variants={itemVariants}
                    >
                        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-accent ">1</div>
                        <p className="text-2xl font-semibold">
                            <b>{t('description.centralize.title')}</b> {t('description.centralize.description')}
                        </p>
                    </motion.div>
                    <motion.div className="flex flex-col p-8 space-y-4 rounded-md bg-primary text-primary-foreground"
                        variants={itemVariants}
                    >
                        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-accent ">2</div>
                        <p className="text-2xl font-semibold">
                            <b>{t('description.sell.title')} &amp; {t('description.sell.title-2')}</b> {t('description.sell.description')}
                        </p>
                    </motion.div>
                    <motion.div className="flex flex-col p-8 space-y-4 rounded-md bg-primary text-primary-foreground"
                        variants={itemVariants}
                    >
                        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-accent ">3</div>
                        <p className="text-2xl font-semibold">
                            <b>{t('description.ship-easily.title')}</b> {t('description.ship-easily.description')}
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
export default FeaturesSection