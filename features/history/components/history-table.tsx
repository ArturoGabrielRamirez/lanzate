"use client"

import { ActionLog } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, MoreHorizontal, User as UserIcon, Clock, Activity, Tag } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"

import { Badge } from "@/features/shadcn/components/ui/badge"
import { Button } from "@/features/shadcn/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/features/shadcn/components/ui/dropdown-menu"
import { DataTable } from "@/features/global/components/data-table"

type ActionLogWithRelations = ActionLog & {
    user?: {
        id: number
        email: string
        first_name: string | null
        last_name: string | null
    } | null
    employee?: {
        id: number
        user: {
            id: number
            email: string
            first_name: string | null
            last_name: string | null
        }
    } | null
}

type Props = {
    data: ActionLogWithRelations[]
    slug: string
}

function HistoryTable({ data, slug }: Props) {

    const t = useTranslations("store.history-table")

    const formatDate = (dateString: string | Date) => {
        return Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(dateString))
    }

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
            case 'UPDATE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
            case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            case 'LOGIN': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
            case 'LOGOUT': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
        }
    }

    const getEntityColor = (entityType: string) => {
        switch (entityType) {
            case 'STORE': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100'
            case 'PRODUCT': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100'
            case 'ORDER': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100'
            case 'BRANCH': return 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100'
            case 'USER': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100'
            case 'EMPLOYEE': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100'
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
        }
    }

    const getActionTranslation = (action: string) => {
        const actionMap = {
            "CREATE": t("actions.create"),
            "UPDATE": t("actions.update"),
            "DELETE": t("actions.delete"),
            "LOGIN": t("actions.login"),
            "LOGOUT": t("actions.logout")
        }
        return actionMap[action as keyof typeof actionMap] || action
    }

    const getEntityTranslation = (entityType: string) => {
        const entityMap = {
            "STORE": t("entities.store"),
            "PRODUCT": t("entities.product"),
            "ORDER": t("entities.order"),
            "BRANCH": t("entities.branch"),
            "USER": t("entities.user"),
            "EMPLOYEE": t("entities.employee")
        }
        return entityMap[entityType as keyof typeof entityMap] || entityType
    }

    const columns: ColumnDef<ActionLogWithRelations>[] = [
        {
            header: () => (
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {t("headers.date")}
                </div>
            ),
            accessorKey: "created_at",
            cell: ({ row }) => {
                const createdAt = row.original.created_at
                return <span className="font-mono text-sm">{formatDate(createdAt)}</span>
            }
        },
        {
            header: () => (
                <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    {t("headers.user")}
                </div>
            ),
            accessorKey: "user.email",
            cell: ({ row }) => {
                const log = row.original
                if (log.user) {
                    return (
                        <div className="flex flex-col">
                            <span className="font-medium">{log.user.email}</span>
                            {(log.user.first_name || log.user.last_name) && (
                                <span className="text-sm text-muted-foreground">
                                    {log.user.first_name} {log.user.last_name}
                                </span>
                            )}
                        </div>
                    )
                } else if (log.employee?.user) {
                    return (
                        <div className="flex flex-col">
                            <span className="font-medium">{log.employee.user.email}</span>
                            <span className="text-sm text-muted-foreground">
                                {t("employee")}
                            </span>
                        </div>
                    )
                } else {
                    return <span className="text-muted-foreground italic">{t("unknown-user")}</span>
                }
            }
        },
        {
            header: () => (
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    {t("headers.action")}
                </div>
            ),
            accessorKey: "action",
            cell: ({ row }) => {
                const action = row.original.action
                return (
                    <Badge className={getActionColor(action)}>
                        {getActionTranslation(action)}
                    </Badge>
                )
            }
        },
        {
            header: () => (
                <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {t("headers.entity-type")}
                </div>
            ),
            accessorKey: "entity_type",
            cell: ({ row }) => {
                const entityType = row.original.entity_type
                return (
                    <Badge variant="outline" className={getEntityColor(entityType)}>
                        {getEntityTranslation(entityType)}
                    </Badge>
                )
            }
        },
        {
            header: t("headers.actions"),
            accessorKey: "actions",
            cell: ({ row }) => {
                const log = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">{t("dropdown.open-menu")}</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">{t("dropdown.actions")}</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/stores/${slug}/logs/${log.id}`} className="flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    {t("dropdown.view-details")}
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]

    return (
        <DataTable
            columns={columns}
            data={data}
            filterKey="entity_type"
        />
    )
}

export { HistoryTable }