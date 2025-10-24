"use client"

import { Order } from "@prisma/client"
import { Download } from "lucide-react"
import { useTranslations } from "next-intl"
import * as XLSX from "xlsx-js-style"

import { Button } from "@/features/shadcn/components/ui/button"

type Props = {
    data: Order[]
}

function ExportOrdersButton({ data }: Props) {
    const t = useTranslations("store.orders-table")

    const handleExport = () => {
        // Create headers with styles
        const headers = [
            {
                v: t("headers.id"),
                t: 's',
                s: {
                    font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
                    fill: { type: "pattern", patternType: "solid", fgColor: { rgb: "4472C4" } },
                    alignment: { horizontal: 'center', vertical: 'center' }
                }
            },
            {
                v: t("headers.status"),
                t: 's',
                s: {
                    font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
                    fill: { type: "pattern", patternType: "solid", fgColor: { rgb: "4472C4" } },
                    alignment: { horizontal: 'center', vertical: 'center' }
                }
            },
            {
                v: t("headers.total"),
                t: 's',
                s: {
                    font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
                    fill: { type: "pattern", patternType: "solid", fgColor: { rgb: "4472C4" } },
                    alignment: { horizontal: 'center', vertical: 'center' }
                }
            },
            {
                v: t("headers.customer"),
                t: 's',
                s: {
                    font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
                    fill: { type: "pattern", patternType: "solid", fgColor: { rgb: "4472C4" } },
                    alignment: { horizontal: 'center', vertical: 'center' }
                }
            },
            {
                v: t("headers.date"),
                t: 's',
                s: {
                    font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
                    fill: { type: "pattern", patternType: "solid", fgColor: { rgb: "4472C4" } },
                    alignment: { horizontal: 'center', vertical: 'center' }
                }
            },
            {
                v: t("headers.items"),
                t: 's',
                s: {
                    font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
                    fill: { type: "pattern", patternType: "solid", fgColor: { rgb: "4472C4" } },
                    alignment: { horizontal: 'center', vertical: 'center' }
                }
            },
            {
                v: t("headers.type"),
                t: 's',
                s: {
                    font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
                    fill: { type: "pattern", patternType: "solid", fgColor: { rgb: "4472C4" } },
                    alignment: { horizontal: 'center', vertical: 'center' }
                }
            },
            {
                v: t("export.payment_status"),
                t: 's',
                s: {
                    font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
                    fill: { type: "pattern", patternType: "solid", fgColor: { rgb: "4472C4" } },
                    alignment: { horizontal: 'center', vertical: 'center' }
                }
            },
            {
                v: t("export.created_at"),
                t: 's',
                s: {
                    font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
                    fill: { type: "pattern", patternType: "solid", fgColor: { rgb: "4472C4" } },
                    alignment: { horizontal: 'center', vertical: 'center' }
                }
            },
            {
                v: t("export.updated_at"),
                t: 's',
                s: {
                    font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
                    fill: { type: "pattern", patternType: "solid", fgColor: { rgb: "4472C4" } },
                    alignment: { horizontal: 'center', vertical: 'center' }
                }
            }
        ]

        // Transform data for Excel export with styles
        const excelData = data.map((order) => [
            {
                v: order.id,
                t: 'n',
                s: { alignment: { horizontal: 'left', vertical: 'center' } }
            },
            {
                v: t(`statuses.${order.status}`),
                t: 's',
                s: { alignment: { horizontal: 'left', vertical: 'center' } }
            },
            {
                v: order.total_price,
                t: 'n',
                s: { alignment: { horizontal: 'left', vertical: 'center' } }
            },
            {
                v: order.customer_name || order.customer_email || t("export.no-customer"),
                t: 's',
                s: { alignment: { horizontal: 'left', vertical: 'center' } }
            },
            {
                v: order.created_at ? new Date(order.created_at).toLocaleDateString() : "",
                t: 's',
                s: { alignment: { horizontal: 'left', vertical: 'center' } }
            },
            {
                v: order.total_quantity || 0,
                t: 'n',
                s: { alignment: { horizontal: 'left', vertical: 'center' } }
            },
            {
                v: order.shipping_method || t("export.no-shipping"),
                t: 's',
                s: { alignment: { horizontal: 'left', vertical: 'center' } }
            },
            {
                v: order.is_paid ? t("export.paid") : t("export.no-payment-status"),
                t: 's',
                s: { alignment: { horizontal: 'left', vertical: 'center' } }
            },
            {
                v: order.created_at ? new Date(order.created_at).toLocaleDateString() : "",
                t: 's',
                s: { alignment: { horizontal: 'left', vertical: 'center' } }
            },
            {
                v: order.updated_at ? new Date(order.updated_at).toLocaleDateString() : "",
                t: 's',
                s: { alignment: { horizontal: 'left', vertical: 'center' } }
            }
        ])

        // Combine headers and data
        const worksheetData = [headers, ...excelData]

        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders")

        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
        const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

        // Download file
        const fileName = `orders-${new Date().toISOString().split('T')[0]}.xlsx`
        const url = window.URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    }

    return (
        <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4" />
            <span className="hidden md:block">{t("export.button")}</span>
        </Button>
    )
}

export { ExportOrdersButton }