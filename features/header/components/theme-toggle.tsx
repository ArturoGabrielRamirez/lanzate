"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"

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
