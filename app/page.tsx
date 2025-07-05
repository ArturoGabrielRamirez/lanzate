"use client"

import { createSupabaseClient } from "@/utils/supabase/client"
import { useEffect } from "react";

export default function Home() {

  /* useEffect(() => {

    const handleShout = (payload: any) => {
      console.log(payload)
    }

    const suscribe = async () => {
      const supabase = await createSupabaseClient()
      const channel = supabase.channel("test")

      channel.on("broadcast", { event: "shout" }, handleShout).subscribe()
    }


    suscribe()

  }, [])
 */

  const sendShout = async () => {
    const supabase = await createSupabaseClient()
    const channel = supabase.channel("test")

    channel.send({
      type: "broadcast",
      event: "shout",
      payload: {
        message: "Shout!"
      }
    })
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button onClick={sendShout}>Send Shout</button>
    </div>
  );
}
