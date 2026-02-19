import { fn } from "@storybook/test"

import { Button } from "@/features/global/components/button/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/features/global/components/dialog/dialog"


import type { Meta, StoryObj } from "@storybook/nextjs-vite"

const meta = {
    title: "Core/Components/Dialog",
    component: Dialog,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        responsive: {
            control: "select",
            options: ["default", "fullscreen-mobile", "drawer-mobile"],
        },
    },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        responsive: "default",
        onOpenChange: fn(),
    },
    render: (args) => (
        <Dialog {...args}>
            <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Default Dialog</DialogTitle>
                    <DialogDescription>
                        This is a standard centered dialog on all screen sizes.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Dialog content goes here. This dialog behaves the same on desktop and mobile.
                    </p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
}

export const SmallSize: Story = {
    args: {
        responsive: "default",
    },
    render: (args) => (
        <Dialog {...args}>
            <DialogTrigger asChild>
                <Button variant="outline">Small Dialog</Button>
            </DialogTrigger>
            <DialogContent size="sm">
                <DialogHeader>
                    <DialogTitle>Small Dialog</DialogTitle>
                    <DialogDescription>A compact dialog with max-w-sm.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">Compact content area.</p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
}

export const LargeSize: Story = {
    args: {
        responsive: "default",
    },
    render: (args) => (
        <Dialog {...args}>
            <DialogTrigger asChild>
                <Button variant="outline">Large Dialog</Button>
            </DialogTrigger>
            <DialogContent size="lg">
                <DialogHeader>
                    <DialogTitle>Large Dialog</DialogTitle>
                    <DialogDescription>A wider dialog with max-w-2xl.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        This dialog has more horizontal space for complex content like tables or forms with multiple columns.
                    </p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
}

export const ExtraLargeSize: Story = {
    args: {
        responsive: "default",
    },
    render: (args) => (
        <Dialog {...args}>
            <DialogTrigger asChild>
                <Button variant="outline">XL Dialog</Button>
            </DialogTrigger>
            <DialogContent size="xl">
                <DialogHeader>
                    <DialogTitle>Extra Large Dialog</DialogTitle>
                    <DialogDescription>A very wide dialog with max-w-4xl.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Ideal for dashboards, data tables, or multi-column layouts.
                    </p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
}

export const FullscreenMobile: Story = {
    args: {
        responsive: "fullscreen-mobile",
    },
    render: (args) => (
        <Dialog {...args}>
            <DialogTrigger asChild>
                <Button variant="outline">Fullscreen Mobile</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Fullscreen on Mobile</DialogTitle>
                    <DialogDescription>
                        Standard dialog on desktop. Full-screen takeover on mobile (&lt;768px).
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 py-4">
                    <p className="text-sm text-muted-foreground">
                        Resize the viewport below 768px to see the fullscreen mobile behavior.
                        The close button (X) appears in the top-right corner.
                    </p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
}

export const DrawerMobile: Story = {
    args: {
        responsive: "drawer-mobile",
    },
    render: (args) => (
        <Dialog {...args}>
            <DialogTrigger asChild>
                <Button variant="outline">Drawer Mobile</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Drawer on Mobile</DialogTitle>
                    <DialogDescription>
                        Standard dialog on desktop. Bottom drawer on mobile (&lt;768px).
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Resize the viewport below 768px to see the drawer behavior.
                        On mobile, this becomes a draggable bottom sheet.
                    </p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
}

export const WithForm: Story = {
    args: {
        responsive: "drawer-mobile",
    },
    render: (args) => (
        <Dialog {...args}>
            <DialogTrigger asChild>
                <Button>Edit Profile</Button>
            </DialogTrigger>
            <DialogContent size="sm">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right text-sm font-medium">
                            Name
                        </label>
                        <input
                            id="name"
                            defaultValue="John Doe"
                            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="username" className="text-right text-sm font-medium">
                            Username
                        </label>
                        <input
                            id="username"
                            defaultValue="@johndoe"
                            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
}
