'use client'

import { Eye, EyeOff, Pointer } from "lucide-react"

import { useKeyboardShortcutsStore } from "@/features/global/stores/keyboard-shortcuts-store"
import { Button } from "@/features/shadcn/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/features/shadcn/components/ui/tooltip"

export function ShortcutsToggle() {
    const { hintMode, toggleHintMode } = useKeyboardShortcutsStore()

    const getIcon = () => {
        switch (hintMode) {
            case 'always':
                return <Eye className="size-4" />
            case 'hover':
                return <Pointer className="size-4" />
            case 'never':
                return <EyeOff className="size-4" />
        }
    }

    const getLabel = () => {
        switch (hintMode) {
            case 'always':
                return 'Siempre visibles'
            case 'hover':
                return 'Al pasar el mouse'
            case 'never':
                return 'Ocultos'
        }
    }

    const getColor = () => {
        switch (hintMode) {
            case 'always':
                return 'text-green-500 hover:text-green-600'
            case 'hover':
                return 'text-blue-500 hover:text-blue-600'
            case 'never':
                return 'text-muted-foreground hover:text-foreground'
        }
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleHintMode}
                    className={`gap-2 ${getColor()} transition-colors`}
                >
                    {getIcon()}
                    <span className="hidden sm:inline text-xs font-medium">{getLabel()}</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <div className="space-y-1">
                    <p className="text-xs font-semibold">Visibilidad de atajos</p>
                    <p className="text-xs text-muted-foreground">
                        Actual: <span className="font-semibold text-foreground">{getLabel()}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">Click para cambiar</p>
                </div>
            </TooltipContent>
        </Tooltip>
    )
}