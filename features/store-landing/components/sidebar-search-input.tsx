"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { useQueryState } from "nuqs"
import { useState } from "react"

function SidebarSearchInput() {

    const [search, setSearch] = useQueryState("search", { shallow: false, clearOnDefault: true })
    const [searchValue, setSearchValue] = useState(search || "")

    const t = useTranslations("subdomain.sidebar.placeholder")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }

    const handleSubmit = () => {
        if (searchValue.length > 0) {
            setSearch(searchValue)
        } else {
            setSearch(null)
        }
    }

    return (
        <div className="flex gap-2 items-center">
            <Input placeholder={t("search")} value={searchValue} onChange={handleChange} />
            <Button variant="outline" onClick={handleSubmit}>
                <Search />
            </Button>
        </div>
    )
}
export default SidebarSearchInput