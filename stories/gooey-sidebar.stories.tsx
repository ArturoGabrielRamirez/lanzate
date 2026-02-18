import { expect, fn, userEvent, within } from "@storybook/test"
import { FileText, Home, Mail, Settings, Star, Users } from "lucide-react"

import { GooeySidebar } from "@/features/global/components/gooey-sidebar/gooey-sidebar"
import type { GooeyTabItem } from "@/features/global/types/gooey-sidebar.types"

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

const sampleTabs: GooeyTabItem[] = [
    {
        icon: <Home className="h-5 w-5" />,
        label: "Home",
        content: (
            <div className="p-6 space-y-3">
                <h3 className="text-lg font-semibold">Home</h3>
                <p className="text-muted-foreground">Welcome to your dashboard. Here you can see an overview of your activity.</p>
                <ul className="space-y-1 text-sm">
                    <li className="border-b border-muted py-2">Recent activity #1</li>
                    <li className="border-b border-muted py-2">Recent activity #2</li>
                    <li className="border-b border-muted py-2">Recent activity #3</li>
                </ul>
            </div>
        ),
    },
    {
        icon: <Users className="h-5 w-5" />,
        label: "Team",
        content: (
            <div className="p-6 space-y-3">
                <h3 className="text-lg font-semibold">Team</h3>
                <p className="text-muted-foreground">Manage your team members and their roles.</p>
                <ul className="space-y-1 text-sm">
                    <li className="border-b border-muted py-2">Alice - Admin</li>
                    <li className="border-b border-muted py-2">Bob - Editor</li>
                    <li className="border-b border-muted py-2">Charlie - Viewer</li>
                </ul>
            </div>
        ),
    },
    {
        icon: <Mail className="h-5 w-5" />,
        label: "Messages",
        content: (
            <div className="p-6 space-y-3">
                <h3 className="text-lg font-semibold">Messages</h3>
                <p className="text-muted-foreground">Your inbox and recent conversations.</p>
                <ul className="space-y-1 text-sm">
                    <li className="border-b border-muted py-2">New project proposal</li>
                    <li className="border-b border-muted py-2">Meeting notes from Friday</li>
                    <li className="border-b border-muted py-2">Design review feedback</li>
                </ul>
            </div>
        ),
    },
    {
        icon: <Settings className="h-5 w-5" />,
        label: "Settings",
        content: (
            <div className="p-6 space-y-3">
                <h3 className="text-lg font-semibold">Settings</h3>
                <p className="text-muted-foreground">Configure your application preferences.</p>
                <ul className="space-y-1 text-sm">
                    <li className="border-b border-muted py-2">Profile settings</li>
                    <li className="border-b border-muted py-2">Notification preferences</li>
                    <li className="border-b border-muted py-2">Security & privacy</li>
                </ul>
            </div>
        ),
    },
]

const minimalTabs: GooeyTabItem[] = [
    {
        icon: <Home className="h-5 w-5" />,
        label: "Home",
        content: <div className="p-6"><p className="text-muted-foreground">Home content</p></div>,
    },
    {
        icon: <Star className="h-5 w-5" />,
        label: "Favorites",
        content: <div className="p-6"><p className="text-muted-foreground">Favorites content</p></div>,
    },
    {
        icon: <FileText className="h-5 w-5" />,
        label: "Documents",
        content: <div className="p-6"><p className="text-muted-foreground">Documents content</p></div>,
    },
]

const meta = {
    title: "Core/Components/GooeySidebar",
    component: GooeySidebar,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["tight", "loose"],
        },
        orientation: {
            control: "select",
            options: ["vertical", "horizontal"],
        },
        gooeyStrength: {
            control: { type: "range", min: 1, max: 30, step: 1 },
        },
        defaultActiveTab: {
            control: { type: "number", min: 0 },
        },
    },
} satisfies Meta<typeof GooeySidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        tabs: sampleTabs,
        size: "loose",
        orientation: "vertical",
        className: "h-[400px] w-[600px]",
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const buttons = canvas.getAllByRole("button")

        await expect(buttons).toHaveLength(4)
        await expect(canvas.getByText("Home")).toBeInTheDocument()
    },
}

export const Tight: Story = {
    args: {
        tabs: sampleTabs,
        size: "tight",
        orientation: "vertical",
        className: "h-[400px] w-[500px]",
    },
}

export const Horizontal: Story = {
    args: {
        tabs: sampleTabs,
        size: "loose",
        orientation: "horizontal",
        className: "h-[400px] w-[600px]",
    },
}

export const HorizontalTight: Story = {
    args: {
        tabs: minimalTabs,
        size: "tight",
        orientation: "horizontal",
        className: "h-[350px] w-[500px]",
    },
}

export const TabSwitch: Story = {
    args: {
        tabs: sampleTabs,
        size: "loose",
        orientation: "vertical",
        onTabChange: fn(),
        className: "h-[400px] w-[600px]",
    },
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement)
        const buttons = canvas.getAllByRole("button")

        // Click second tab
        await userEvent.click(buttons[1])
        await expect(args.onTabChange).toHaveBeenCalledWith(1)
        await expect(canvas.getByText("Team")).toBeInTheDocument()

        // Click third tab
        await userEvent.click(buttons[2])
        await expect(args.onTabChange).toHaveBeenCalledWith(2)
        await expect(canvas.getByText("Messages")).toBeInTheDocument()
    },
}

export const CustomGooeyStrength: Story = {
    args: {
        tabs: sampleTabs,
        size: "loose",
        orientation: "vertical",
        gooeyStrength: 25,
        className: "h-[400px] w-[600px]",
    },
}

export const StartOnSecondTab: Story = {
    args: {
        tabs: sampleTabs,
        size: "loose",
        orientation: "vertical",
        defaultActiveTab: 1,
        className: "h-[400px] w-[600px]",
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByText("Team")).toBeInTheDocument()
        await expect(canvas.getByText("Manage your team members and their roles.")).toBeInTheDocument()
    },
}
