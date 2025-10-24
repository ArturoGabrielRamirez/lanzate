import { FooterSection } from "@/features/footer/components";
import { getUserInfo } from "@/features/global/actions/get-user-info.action";

async function Footer() {

    const { payload: user } = await getUserInfo()

    if (user) return null

    return <FooterSection />
}

export { Footer }