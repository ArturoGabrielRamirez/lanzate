import { OctagonX } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl';

export default function ErrorPage() {

    const t = useTranslations("error");

    return (
        <section className='grow flex flex-col items-center justify-center gap-4 relative'>
            <OctagonX className='text-destructive' size={50} />
            <div className='flex flex-col items-center justify-center gap-2'>
                <p className='text-4xl font-bold'>{t("oops")}</p>
                <p className='text-lg'>{t("something-went-wrong")}</p>
            </div>
            <Link href='/' className='mt-6 text-blue-500 hover:underline'>
                {t("go-back")}
            </Link>
        </section>
    )

}