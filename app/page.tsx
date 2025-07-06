"use client"
import { sendNotification } from "@/features/header/actions/sendNotification"
export default function Home() {

  const handleSendNotification = async () => {
    const res = await sendNotification()
    console.log("🚀 ~ handleSendNotification ~ res:", res)
  }

  return (
    <div>
      <button onClick={handleSendNotification}>Send Shout</button>
    </div>
  );
}
