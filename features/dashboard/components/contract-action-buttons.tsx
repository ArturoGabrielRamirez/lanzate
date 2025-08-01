"use client"

import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"

type ContractActionButtonsProps = {
    fileUrl: string
    title: string
}

function ContractActionButtons({ fileUrl, title }: ContractActionButtonsProps) {
    const handleView = () => {
        window.open(fileUrl, '_blank')
    }

    const handleDownload = () => {
        const link = document.createElement('a')
        link.href = fileUrl
        link.download = title || 'contrato'
        link.click()
    }

    return (
        <div className="flex items-center space-x-2">
            <Button
                variant="outline"
                size="sm"
                onClick={handleView}
            >
                <Eye className="w-3 h-3 mr-1" />
                Ver
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
            >
                <Download className="w-3 h-3 mr-1" />
                Descargar
            </Button>
        </div>
    )
}

export default ContractActionButtons 