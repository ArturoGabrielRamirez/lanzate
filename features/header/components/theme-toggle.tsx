"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"

function ThemeToggle() {

    const { theme, setTheme } = useTheme()

    return (
        <IconButton
            className="text-primary"
            icon={theme === "dark" ? Moon : Sun}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
    )
}
export { ThemeToggle }
