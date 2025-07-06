"use client"
import { Button } from "@/components/ui/button"
import { sendNotification } from "@/features/header/actions/sendNotification"
import Title from "@/features/layout/components/title"

export default function Home() {

  const handleSendNotification = async () => {
    const res = await sendNotification()
    console.log("🚀 ~ handleSendNotification ~ res:", res)
  }

  return (
    <div className="p-4">
      <Title title="Home" />
      <Button onClick={handleSendNotification}>Send Shout</Button>
    </div>
  );
}
