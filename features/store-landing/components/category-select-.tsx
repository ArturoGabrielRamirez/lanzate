"use client"
import CreatableSelect from "react-select/creatable"
import makeAnimated from 'react-select/animated';
import { useState, useEffect } from "react";
import { getCategories } from "../actions/getCategories";
import { Label } from "@/components/ui/label";

const animatedComponents = makeAnimated();

type CategorySelectProps = {
    onChange?: (value: any) => void
}

function CategorySelect({ onChange }: CategorySelectProps) {

    const [categories, setCategories] = useState<{ label: string, value: number }[]>([])

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
        <div className="flex flex-col gap-1">
            <Label htmlFor="category">Category</Label>
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
            />
        </div>
    )
}
export default CategorySelect