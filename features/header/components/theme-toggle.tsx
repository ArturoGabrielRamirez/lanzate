"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

function ThemeToggle() {

    const { theme, setTheme } = useTheme()

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="cursor-pointer"
        >
            {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
    )
}
export default ThemeToggle
