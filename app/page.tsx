import Image from "next/image";

import { createClient } from '@/utils/supabase/server-props'
import Title from "@/components/Tiltle/Title";
import GridForms from "@/components/Visuals/GridFroms";

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  console.log('Session:', user);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
  {/*     <GridForms className="w-full max-w-2xl">
        <Title title="Lanzate" subtitle="Home" />
      </GridForms> */}
    </div>
  );
}
