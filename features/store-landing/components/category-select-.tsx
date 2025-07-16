"use client"
import CreatableSelect from "react-select/creatable"
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();
const categories = [
    { label: "Electronics", value: "electronics" },
    { label: "Clothing", value: "clothing" },
    { label: "Home", value: "home" },
    { label: "Beauty", value: "beauty" },
    { label: "Toys", value: "toys" },
    { label: "Sports", value: "sports" },
    { label: "Automotive", value: "automotive" },
]

type CategorySelectProps = {
    onChange?: (value: any) => void
}

function CategorySelect({ onChange }: CategorySelectProps) {

    const handleChange = (value: any) => {
        if (onChange && typeof onChange === "function") onChange(value)
    }

    return (
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
    )
}
export default CategorySelect