import GridForms from "@/components/Visuals/GridFroms";
import Title from "@/components/Tiltle/Title";
import { createClient } from "@/utils/supabase/server-props";

export default async function AccountPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    return (
        <div className="grow bg-gray-800">
            <GridForms className='grid grid-rows-[30px_1fr_1fr] grid-cols-[1fr] sm:grid-rows-[40px_1fr] sm:grid-cols-[1fr_1px_1fr] grow items-center justify-center bg-white dark:bg-gray-800 sm:gap-x-20 sm:p-8'>
                <Title title="Account" />
            </GridForms>
        </div>
    );
}