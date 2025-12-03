"use client"

import { Edit2, Trash2, X } from "lucide-react"

import { Button } from "@/features/shadcn/components/button"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/features/shadcn/components/item"

interface OptionViewProps {
    option: {
        id?: string
        name: string
        values?: Array<{ id?: string; value: string }>
    }
    index: number
    disabled?: boolean
    onEdit: () => void
    onRemove: () => void
    onRemoveValue: (valueIndex: number) => void
}

export function OptionView({
    option,
    index,
    disabled,
    onEdit,
    onRemove,
    onRemoveValue,
}: OptionViewProps) {
    return (
        <Item variant="outline" key={option.id || index} size="sm">
            <ItemContent className="flex-1">
                <ItemTitle>{option.name}</ItemTitle>
                <div className="flex flex-wrap gap-2">
                    {option.values?.map((val, vIndex) => (
                        <Badge key={val.id || vIndex} variant="secondary" className="pr-1">
                            {val.value}
                            <button
                                onClick={() => onRemoveValue(vIndex)}
                                className="ml-1 hover:text-destructive focus:outline-none"
                                disabled={disabled}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            </ItemContent>
            <ItemActions>
                <Button variant="ghost" size="icon-sm" onClick={onEdit} disabled={disabled}>
                    <Edit2 className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={onRemove} disabled={disabled} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </ItemActions>
        </Item>
    )
}

