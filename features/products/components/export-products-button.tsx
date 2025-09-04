"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useTranslations } from "next-intl"
import { Product, Category } from "@prisma/client"
import * as XLSX from "xlsx-js-style"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"

type Props = {
    data: (Product & { categories: Category[] })[]
    onlyIcon?: boolean
}

function ExportProductsButton({ data, onlyIcon }: Props) {
    const t = useTranslations("store.products-table")

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
                v: t("headers.name"),
                t: 's',
                s: {
                    font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
                    fill: { type: "pattern", patternType: "solid", fgColor: { rgb: "4472C4" } },
                    alignment: { horizontal: 'center', vertical: 'center' }
                }
            },
            {
                v: t("headers.price"),
                t: 's',
                s: {
                    font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
                    fill: { type: "pattern", patternType: "solid", fgColor: { rgb: "4472C4" } },
                    alignment: { horizontal: 'center', vertical: 'center' }
                }
            },
            {
                v: t("headers.categories"),
                t: 's',
                s: {
                    font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
                    fill: { type: "pattern", patternType: "solid", fgColor: { rgb: "4472C4" } },
                    alignment: { horizontal: 'center', vertical: 'center' }
                }
            },
            {
                v: t("headers.stock"),
                t: 's',
                s: {
                    font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
                    fill: { type: "pattern", patternType: "solid", fgColor: { rgb: "4472C4" } },
                    alignment: { horizontal: 'center', vertical: 'center' }
                }
            },
            {
                v: t("headers.featured"),
                t: 's',
                s: {
                    font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
                    fill: { type: "pattern", patternType: "solid", fgColor: { rgb: "4472C4" } },
                    alignment: { horizontal: 'center', vertical: 'center' }
                }
            },
            {
                v: t("headers.active"),
                t: 's',
                s: {
                    font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
                    fill: { type: "pattern", patternType: "solid", fgColor: { rgb: "4472C4" } },
                    alignment: { horizontal: 'center', vertical: 'center' }
                }
            },
            {
                v: t("export.description"),
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
        const excelData = data.map((product) => [
            {
                v: product.id,
                t: 'n',
                s: { alignment: { horizontal: 'left', vertical: 'center' } }
            },
            {
                v: product.name,
                t: 's',
                s: { alignment: { horizontal: 'left', vertical: 'center' } }
            },
            {
                v: product.price,
                t: 'n',
                s: { alignment: { horizontal: 'left', vertical: 'center' } }
            },
            {
                v: product.categories?.map((category: Category) => category.name).join(", ") || t("categories.none"),
                t: 's',
                s: { alignment: { horizontal: 'left', vertical: 'center' } }
            },
            {
                v: product.stock,
                t: 'n',
                s: { alignment: { horizontal: 'left', vertical: 'center' } }
            },
            {
                v: product.is_featured ? t("boolean.yes") : t("boolean.no"),
                t: 's',
                s: { alignment: { horizontal: 'left', vertical: 'center' } }
            },
            {
                v: product.is_published ? t("boolean.yes") : t("boolean.no"),
                t: 's',
                s: { alignment: { horizontal: 'left', vertical: 'center' } }
            },
            {
                v: product.description || "",
                t: 's',
                s: { alignment: { horizontal: 'left', vertical: 'center' } }
            },
            {
                v: product.created_at ? new Date(product.created_at).toLocaleDateString() : "",
                t: 's',
                s: { alignment: { horizontal: 'left', vertical: 'center' } }
            },
            {
                v: product.updated_at ? new Date(product.updated_at).toLocaleDateString() : "",
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products")

        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
        const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

        // Download file
        const fileName = `products-${new Date().toISOString().split('T')[0]}.xlsx`
        const url = window.URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    }

    if (onlyIcon) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <IconButton icon={() => <Download className="w-4 h-4" />} size="md" onClick={handleExport} />
                </TooltipTrigger>
                <TooltipContent>
                    {t("export.button")}
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4" />
            <span className="hidden md:block">{t("export.button")}</span>
        </Button>
    )
}

export default ExportProductsButton 