"use client"
import CreatableSelect from "react-select/creatable"
import makeAnimated from 'react-select/animated';
import { useState, useEffect } from "react";
import { getCategories } from "../actions/getCategories";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

const animatedComponents = makeAnimated();

type CategorySelectProps = {
    onChange?: (value: any) => void
    defaultValue?: any
    withLabel?: boolean
}

function CategorySelect({ onChange, defaultValue, withLabel = true }: CategorySelectProps) {

    const [categories, setCategories] = useState<{ label: string, value: number }[]>([])

    const t = useTranslations("subdomain.categories");

    useEffect(() => {
        const fetchCategories = async () => {
            const { payload, error } = await getCategories()
            if (error) return console.log(error)
            setCategories(payload.map((cat) => ({ label: cat.name, value: cat.id })))
        }

        fetchCategories()
    }, [])

    const handleChange = (value: any) => {
        if (onChange && typeof onChange === "function") onChange(value)
    }

    return (
        <div className="flex flex-col gap-1 w-full">
            {withLabel && <Label htmlFor="category">{t("category")}</Label>}
            <CreatableSelect
                className="w-full"
                classNames={{
                    control: () => "!bg-input/30 !border-input",
                    menu: () => "!bg-background rounded-md overflow-hidden",
                    option: () => "!text-sm hover:!bg-accent",
                    indicatorSeparator: () => "!hidden",
                    dropdownIndicator: () => "!text-muted-foreground",
                }}
                isMulti
                options={categories}
                components={animatedComponents}
                onChange={handleChange}
                defaultValue={defaultValue}
            />
        </div>
    )
}
export default CategorySelect