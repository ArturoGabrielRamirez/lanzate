import { ArrowLeft, UserCheck, UserX, Calendar, Building, Briefcase, DollarSign, Shield, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { getEmployeeDetailsAction } from "@/features/employees/actions/get-employee-details.action"
import { DeleteEmployeeButton, EditEmployeeButton } from "@/features/employees/components"
import { EmployeeDetailPageProps } from "@/features/employees/types"
import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"

async function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {

    const { slug, id } = await params

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: employee, hasError } = await getEmployeeDetailsAction(id)

    if (hasError || !employee) {
        return console.log(hasError)
    }

    const formatDate = (date: Date | string) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const t = await getTranslations("employee")

    const permissions = [
        { key: 'can_create_orders', label: t("create-orders"), value: employee.can_create_orders },
        { key: 'can_update_orders', label: t("update-orders"), value: employee.can_update_orders },
        { key: 'can_create_products', label: t("create-products"), value: employee.can_create_products },
        { key: 'can_update_products', label: t("update-products"), value: employee.can_update_products },
        { key: 'can_manage_stock', label: t("manage-stock"), value: employee.can_manage_stock },
        { key: 'can_process_refunds', label: t("process-refunds"), value: employee.can_process_refunds },
        { key: 'can_view_reports', label: t("view-reports"), value: employee.can_view_reports },
        { key: 'can_manage_employees', label: t("manage-employees"), value: employee.can_manage_employees },
        { key: 'can_manage_store', label: t("manage-store"), value: employee.can_manage_store },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Link href={`/stores/${slug}/employees`}>
                        <ArrowLeft className="size-4" />
                    </Link>
                    {t("employee-details")}
                </CardTitle>
            </CardHeader>
            <CardContent className="grow flex">
                <div className="grid grid-cols-1 lg:grid-cols-[max-content_1fr] grid-rows-[auto_1fr] lg:grid-rows-1 gap-6 w-full">
                    {/* Employee Avatar */}
                    <div className="w-full h-35 lg:h-full lg:w-60 xl:w-80 overflow-hidden rounded-md group bg-secondary relative flex items-center justify-center">
                        {employee.user?.avatar ? (
                            <Image
                                src={employee.user.avatar}
                                alt={`${employee.user.first_name || 'Employee'} avatar`}
                                className="object-cover h-full w-full bg-center group-hover:scale-105 transition-all duration-300 rounded-md"
                                fill
                            />
                        ) : (
                            <Image
                                src={`https://api.dicebear.com/9.x/initials/svg?seed=${employee.user?.first_name || 'Employee'} ${employee.user?.last_name || ''}`}
                                alt="Employee Avatar"
                                className="object-cover h-full w-full bg-center group-hover:scale-105 transition-all duration-300 rounded-md"
                                fill
                            />
                        )}
                    </div>

                    {/* Employee Details */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <h3 className="text-4xl font-bold">
                                {employee.user?.first_name} {employee.user?.last_name || employee.user?.email}
                            </h3>
                            <p className="text-xl text-muted-foreground">{employee.user?.email}</p>
                        </div>

                        {/* Status and Role */}
                        <div className="flex gap-2 flex-wrap">
                            <Badge variant={employee.is_active ? "default" : "destructive"} className="flex items-center gap-1">
                                {employee.is_active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                                {employee.is_active ? t("active") : t("inactive")}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                {employee.role}
                            </Badge>
                        </div>

                        {/* Employee Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {employee.position && (
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">{t("position")}</p>
                                        <p className="text-sm text-muted-foreground">{employee.position}</p>
                                    </div>
                                </div>
                            )}

                            {employee.department && (
                                <div className="flex items-center gap-2">
                                    <Building className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">{t("department")}</p>
                                        <p className="text-sm text-muted-foreground">{employee.department}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">{t("hired-date")}</p>
                                    <p className="text-sm text-muted-foreground">{formatDate(employee.hired_at)}</p>
                                </div>
                            </div>

                            {employee.salary && (
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">{t("salary")}</p>
                                        <p className="text-sm text-muted-foreground">${employee.salary.toLocaleString()}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Notes */}
                        {employee.notes && (
                            <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 text-muted-foreground mt-1" />
                                <div>
                                    <p className="text-sm font-medium">{t("notes")}</p>
                                    <p className="text-sm text-muted-foreground">{employee.notes}</p>
                                </div>
                            </div>
                        )}

                        {/* Permissions */}
                        <div>
                            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Permissions
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {permissions.map((permission) => (
                                    <Badge
                                        key={permission.key}
                                        variant={permission.value ? "default" : "outline"}
                                        className="justify-start"
                                    >
                                        {permission.value ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
                                        {permission.label}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center md:justify-end mt-auto">
                            <div className="grid grid-cols-2 gap-4 mt-auto justify-end max-w-xs">
                                <DeleteEmployeeButton
                                    employeeId={employee.id}
                                    slug={slug}
                                    userId={user.id}
                                />
                                <EditEmployeeButton
                                    employee={employee}
                                    slug={slug}
                                    userId={user.id}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default EmployeeDetailPage 