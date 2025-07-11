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

function CategorySelect() {

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
        />
    )
}
export default CategorySelect