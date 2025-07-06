import Title from "@/features/layout/components/title";
import { createClient } from "@/utils/supabase/server-props";

export default async function AccountPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    return (
        <div className="p-4">
            <Title title="Account"/>
        </div>
    );

}