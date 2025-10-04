import { NextRequest, NextResponse } from "next/server"
import { createServerSideClient } from "@/utils/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get("file") as unknown as File | null
    const storeIdRaw = form.get("storeId") as string | null

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })
    if (!storeIdRaw) return NextResponse.json({ error: "Missing storeId" }, { status: 400 })

    const storeId = parseInt(storeIdRaw)
    if (Number.isNaN(storeId)) return NextResponse.json({ error: "Invalid storeId" }, { status: 400 })

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    if (!allowed.includes(file.type)) return NextResponse.json({ error: "Invalid file type" }, { status: 400 })

    if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    const ext = file.type.split("/")[1] || file.name.split(".").pop() || "jpg"
    const base = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_")
    const filePath = `${storeId}/store-${storeId}-${Date.now()}-${base}.${ext}`

    const supabase = await createServerSideClient()
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, buffer, { contentType: file.type, upsert: false })

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath)

    return NextResponse.json({ url: publicUrlData.publicUrl, path: filePath })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}


