import Image from "next/image";

import { createClient } from '@/utils/supabase/server-props'
import { handleGoogleLogIn } from "./actions/handleGoogleLogIn"
export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  console.log('Session:', user);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

        {/*    {supabase.auth.user() ? (
          <div className="text-2xl font-semibold">
            Welcome, {supabase.auth.user()?.email}!
          </div>
        ) : ( */}
        <form className="flex flex-col items-center sm:items-start gap-4">
          <h1 className="text-3xl font-bold">Welcome to Lanzate!</h1>
          <p className="text-lg">Please log in to continue.</p>
          <button
            onClick={handleGoogleLogIn}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Log in with Google
          </button>
        </form>
       
      </main>
    </div>
  );
}
