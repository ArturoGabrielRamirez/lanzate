'use client'

import React from 'react'

import { ToolButtonProps } from '@/features/global/types/media'

export function ToolButton({
    icon: Icon,
    label,
    onClick,
    disabled,
    color = 'default',
    compact = false
}: ToolButtonProps) {
    const colors = {
        default: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30',
        camera: 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30',
        crop: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30',
        ai: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30'
    }

    const iconColors = {
        default: 'text-blue-400',
        camera: 'text-cyan-400',
        crop: 'text-orange-400',
        ai: 'text-purple-400'
    }

    if (compact) {
        return (
            <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                title={label}
                className={`group flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition-all w-[56px] h-[56px] flex-shrink-0 ${colors[color]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
                <Icon className={`w-5 h-5 flex-shrink-0 ${iconColors[color]}`} />
                <span className="text-[9px] font-medium leading-none whitespace-nowrap">{label}</span>
            </button>
        )
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`group flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${colors[color]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Icon className={`w-5 h-5 ${iconColors[color]}`} />
            </div>
            <span className="text-xs font-medium">{label}</span>
        </button>
    )
}