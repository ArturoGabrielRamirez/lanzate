"use client"

import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { employeeUpdateSchema } from "../schemas/employee-schema"
import { editEmployee } from "../actions/editEmployee"
import { formatErrorResponse } from "@/utils/lib"
import { Pencil } from "lucide-react"
import { EditEmployeeButtonProps } from "@/features/employees/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useState } from "react"

function EditEmployeeButton({ employee, slug, onComplete, userId }: EditEmployeeButtonProps) {
    
    const [permissions, setPermissions] = useState({
        can_create_orders: employee.can_create_orders,
        can_update_orders: employee.can_update_orders,
        can_create_products: employee.can_create_products,
        can_update_products: employee.can_update_products,
        can_manage_stock: employee.can_manage_stock,
        can_process_refunds: employee.can_process_refunds,
        can_view_reports: employee.can_view_reports,
        can_manage_employees: employee.can_manage_employees,
        can_manage_store: employee.can_manage_store,
    })

    const [isActive, setIsActive] = useState(employee.is_active)
    const [selectedRole, setSelectedRole] = useState(employee.role)
    const [salary, setSalary] = useState(employee.salary?.toString() || "")

    const handleEditEmployee = async (payload: any) => {
        const data = {
            ...payload,
            ...permissions,
            is_active: isActive,
            role: selectedRole,
            salary: salary ? parseFloat(salary) : undefined,
        }

        return editEmployee(employee.id, data, slug, userId)
    }

    const handlePermissionChange = (permission: keyof typeof permissions, checked: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [permission]: checked
        }))
    }

    const roleOptions = [
        { value: 'EMPLOYEE', label: 'Employee' },
        { value: 'CASHIER', label: 'Cashier' },
        { value: 'STOCKIST', label: 'Stockist' },
        { value: 'SALES', label: 'Sales' },
        { value: 'SUPERVISOR', label: 'Supervisor' },
        { value: 'MANAGER', label: 'Manager' },
    ]

    return (
        <ButtonWithPopup
            text={(
                <>
                    <Pencil className="text-muted-foreground size-4" />
                    Edit Employee
                </>
            )}
            title="Edit employee"
            schema={employeeUpdateSchema}
            description="Edit the employee's role, permissions and other details. Note: Email and name cannot be changed as they belong to the user account."
            action={handleEditEmployee}
            onComplete={onComplete}
            messages={{
                success: "Employee updated successfully!",
                error: "Failed to update employee",
                loading: "Updating employee..."
            }}
            className="bg-transparent w-full justify-start"
        >
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                {/* User info (read-only) */}
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <h4 className="font-medium text-sm mb-2">Employee User Information</h4>
                    <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {employee.user?.email || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Name:</strong> {employee.user?.first_name} {employee.user?.last_name || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Note: Email and name cannot be edited here as they are part of the user's account
                    </p>
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            {roleOptions.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                    {role.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Basic fields */}
                <InputField 
                    name="position" 
                    label="Position" 
                    type="text" 
                    defaultValue={employee.position || ""} 
                />
                <InputField 
                    name="department" 
                    label="Department" 
                    type="text" 
                    defaultValue={employee.department || ""} 
                />
                
                {/* Salary - now controlled */}
                <div className="space-y-2">
                    <Label htmlFor="salary">Salary</Label>
                    <Input 
                        type="number" 
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        placeholder="Enter salary"
                    />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                        name="notes" 
                        placeholder="Additional notes about the employee..."
                        defaultValue={employee.notes || ""}
                    />
                </div>

                {/* Active status */}
                <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="is_active" 
                        checked={isActive} 
                        onCheckedChange={(checked) => setIsActive(checked === true)}
                    />
                    <Label 
                        htmlFor="is_active" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Employee is active
                    </Label>
                </div>

                {/* Permissions section */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium">Permissions</h4>
                    
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="can_create_orders" 
                                checked={permissions.can_create_orders}
                                onCheckedChange={(checked) => handlePermissionChange('can_create_orders', checked as boolean)}
                            />
                            <Label htmlFor="can_create_orders" className="text-sm">Can create orders</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="can_update_orders" 
                                checked={permissions.can_update_orders}
                                onCheckedChange={(checked) => handlePermissionChange('can_update_orders', checked as boolean)}
                            />
                            <Label htmlFor="can_update_orders" className="text-sm">Can update orders</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="can_create_products" 
                                checked={permissions.can_create_products}
                                onCheckedChange={(checked) => handlePermissionChange('can_create_products', checked as boolean)}
                            />
                            <Label htmlFor="can_create_products" className="text-sm">Can create products</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="can_update_products" 
                                checked={permissions.can_update_products}
                                onCheckedChange={(checked) => handlePermissionChange('can_update_products', checked as boolean)}
                            />
                            <Label htmlFor="can_update_products" className="text-sm">Can update products</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="can_manage_stock" 
                                checked={permissions.can_manage_stock}
                                onCheckedChange={(checked) => handlePermissionChange('can_manage_stock', checked as boolean)}
                            />
                            <Label htmlFor="can_manage_stock" className="text-sm">Can manage stock</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="can_process_refunds" 
                                checked={permissions.can_process_refunds}
                                onCheckedChange={(checked) => handlePermissionChange('can_process_refunds', checked as boolean)}
                            />
                            <Label htmlFor="can_process_refunds" className="text-sm">Can process refunds</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="can_view_reports" 
                                checked={permissions.can_view_reports}
                                onCheckedChange={(checked) => handlePermissionChange('can_view_reports', checked as boolean)}
                            />
                            <Label htmlFor="can_view_reports" className="text-sm">Can view reports</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="can_manage_employees" 
                                checked={permissions.can_manage_employees}
                                onCheckedChange={(checked) => handlePermissionChange('can_manage_employees', checked as boolean)}
                            />
                            <Label htmlFor="can_manage_employees" className="text-sm">Can manage employees</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="can_manage_store" 
                                checked={permissions.can_manage_store}
                                onCheckedChange={(checked) => handlePermissionChange('can_manage_store', checked as boolean)}
                            />
                            <Label htmlFor="can_manage_store" className="text-sm">Can manage store</Label>
                        </div>
                    </div>
                </div>
            </div>
        </ButtonWithPopup>
    )
}

export default EditEmployeeButton 