import { ArrowLeft, Activity, User, Clock, Tag, Hash, FileText, Info, UserCheck } from "lucide-react"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getLogDetailsAction} from "@/features/stores/actions/get-log-details.action"
import { LogDetailPageProps } from "@/features/stores/types"

async function LogDetailPage({ params }: LogDetailPageProps) {

    const { slug, id } = await params

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: log, hasError } = await getLogDetailsAction(id)

    if (hasError || !log) {
        return console.log(hasError)
    }

    const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
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

    const t = await getTranslations("store.logs")

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

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Link href={`/stores/${slug}/history`}>
                        <ArrowLeft className="size-4" />
                    </Link>
                    {t("log-details")}#{log.id}
                </CardTitle>
            </CardHeader>
            <CardContent className="grow flex">
                <div className="grid grid-cols-1 gap-6 w-full">

                    {/* Basic Log Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Hash className="w-4 h-4" />
                                    {t("log-id")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-mono text-lg">{log.id}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {t("created-at")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-mono">{formatDate(log.created_at)}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Action and Entity Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    {t("action")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Badge className={getActionColor(log.action)} variant="secondary">
                                    {log.action}
                                </Badge>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    {t("entity-type")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-2">
                                    <Badge variant="outline" className={getEntityColor(log.entity_type)}>
                                        {log.entity_type}
                                    </Badge>
                                    <p className="text-sm text-muted-foreground">
                                        {t("entity-id")}<span className="font-mono">{log.entity_id}</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* User Information */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {t("user-information")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {log.user ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span className="font-medium">{log.user.email}</span>
                                    </div>
                                    {(log.user.first_name || log.user.last_name) && (
                                        <p className="text-sm text-muted-foreground">
                                            {t("name")}:{log.user.first_name} {log.user.last_name}
                                        </p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        {t("user-id")}<span className="font-mono">{log.user.id}</span>
                                    </p>
                                </div>
                            ) : log.employee?.user ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <UserCheck className="w-4 h-4" />
                                        <span className="font-medium">{log.employee.user.email}</span>
                                        <Badge variant="outline">{t("employee")}</Badge>
                                    </div>
                                    {(log.employee.user.first_name || log.employee.user.last_name) && (
                                        <p className="text-sm text-muted-foreground">
                                            {t("name")}{log.employee.user.first_name} {log.employee.user.last_name}
                                        </p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        {t("employee-id")}<span className="font-mono">{log.employee_id}</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {t("user-id")}<span className="font-mono">{log.employee.user.id}</span>
                                    </p>
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic">{t("unknown-user")}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {log.action_initiator && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        {t("action-initiator")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{log.action_initiator}</p>
                                </CardContent>
                            </Card>
                        )}

                        {log.details && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        {t("details")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm whitespace-pre-wrap">{log.details}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Timestamps */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {t("timestamps")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">{t("created-at")}</p>
                                    <p className="font-mono text-sm">{formatDate(log.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t("updated-at")}</p>
                                    <p className="font-mono text-sm">{formatDate(log.updated_at)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </CardContent>
        </Card>
    )
}

export default LogDetailPage 