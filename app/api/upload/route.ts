import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import fs from 'fs'
import { join } from 'path'
import { getCurrentUser } from '@/features/auth/actions'

export async function POST(request: NextRequest) {
  try {
    const { user } = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const type: string = data.get('type') as string

    if (!file) {
      return NextResponse.json({ error: 'No se encontró archivo' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Tipo de archivo no válido' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Archivo muy grande' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileName = `${user.id}-${type}-${Date.now()}.${file.name.split('.').pop()}`
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    const path = join(uploadDir, fileName)

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    await writeFile(path, buffer)
    
    const url = `/uploads/${fileName}`
    
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
