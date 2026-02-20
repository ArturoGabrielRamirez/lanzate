import { redirect } from 'next/navigation'

interface OperationsPageProps {
  params: Promise<{ subdomain: string; locale: string }>
}

export default async function OperationsPage({ params }: OperationsPageProps) {
  const { subdomain, locale } = await params
  redirect(`/${locale}/stores/${subdomain}/operations/branches`)
}
