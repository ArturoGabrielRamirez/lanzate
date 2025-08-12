import { PrimaryButton, SecondaryButton, IconButton, DangerButton } from "@/features/layout/components/universal-button"
import { Info, Trash2, X } from "lucide-react"

function Swatches() {
    return (
        <section className="pt-20 px-4 flex flex-col gap-4">
            <div className="flex gap-2 items-center flex-wrap">
                <PrimaryButton>
                    Primary Button
                </PrimaryButton>
                <PrimaryButton startContent={<Info className="size-4 md:size-5" />}>
                    Primary Button
                </PrimaryButton>
                <PrimaryButton isLoading>
                    Loading Button
                </PrimaryButton>
                <PrimaryButton isDisabled>
                    Disabled Button
                </PrimaryButton>
                <PrimaryButton tooltip="This is a tooltip">
                    Tooltip Button
                </PrimaryButton>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
                <SecondaryButton>
                    Secondary Button
                </SecondaryButton>
                <SecondaryButton startContent={<Info className="size-4 md:size-5" />}>
                    Secondary Button
                </SecondaryButton>
                <SecondaryButton isLoading>
                    Loading Button
                </SecondaryButton>
                <SecondaryButton isDisabled>
                    Disabled Button
                </SecondaryButton>
                <SecondaryButton tooltip="This is a tooltip">
                    Tooltip Button
                </SecondaryButton>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
                <DangerButton>
                    Danger Button
                </DangerButton>
                <DangerButton startContent={<Trash2 className="size-4 md:size-5" />}>
                    Danger Button
                </DangerButton>
                <DangerButton isLoading>
                    Loading Button
                </DangerButton>
                <DangerButton isDisabled>
                    Disabled Button
                </DangerButton>
                <DangerButton tooltip="This is a tooltip">
                    Tooltip Button
                </DangerButton>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
                <IconButton isIconOnly>
                    <Info />
                </IconButton>
                <IconButton isIconOnly isLoading>
                    <Info />
                </IconButton>
                <IconButton isIconOnly tooltip="This is a tooltip">
                    <Info />
                </IconButton>
                <IconButton isIconOnly tooltip="This is a tooltip" color="danger">
                    <Trash2 />
                </IconButton>
            </div>
        </section>
    )
}
export default Swatches