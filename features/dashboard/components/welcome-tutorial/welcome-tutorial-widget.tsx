"use client"

import { BadgeCheckIcon, ChevronRightIcon } from "lucide-react"

import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/features/shadcn/components/item"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"

function WelcomeTutorialWidget({ onRetakeTutorial }: { onRetakeTutorial: () => void }) {

    const handleRetakeTutorialClick = () => {
        onRetakeTutorial()
    }

    return (
        <Item variant="outline" size="sm" className="bg-card/50 hover:bg-card/75 transition-all group rounded-md">
            <ItemMedia className="opacity-50 group-hover:opacity-100 transition-all">
                <BadgeCheckIcon className="size-5" />
            </ItemMedia>
            <ItemContent className="opacity-50 group-hover:opacity-100 transition-all">
                <ItemTitle>Retomar el tutorial de bienvenida</ItemTitle>
            </ItemContent>
            <ItemActions className="opacity-50 group-hover:opacity-100 transition-all">
                <IconButton
                    icon={ChevronRightIcon}
                    onClick={handleRetakeTutorialClick}
                />
            </ItemActions>
        </Item>
    )
}

export { WelcomeTutorialWidget }