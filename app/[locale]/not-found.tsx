import { OctagonX } from 'lucide-react'
import { useTranslations } from 'next-intl';
import Link from 'next/link'

export default function NotFound() {

    const t = useTranslations("error");
    return (
        <section className='flex flex-col items-center justify-center gap-4 grow'>
            <OctagonX className='text-destructive' size={50} />
            <div className='flex flex-col items-center justify-center gap-2'>
                <p className='text-4xl font-bold'>{t("oops")}</p>
                <p className='text-lg'>{t("page-not-founded")}</p>
            </div>
            <Link href='/' className='mt-6 text-blue-500 hover:underline'>
                {t("go-back")}
            </Link>
        </section>
    )
}