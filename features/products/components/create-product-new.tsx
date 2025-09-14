"use client"

import React, { useState } from "react"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Textarea } from "@/components/ui/textarea"
import { MultiStepFormWrapper, Step, useMultiStepForm } from "@/components/multi-step-form-wrapper"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Box, Globe, Plus } from "lucide-react"

const basicInfoSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    url: z.url()
})

const messageSchema = z.object({
    subject: z.string().min(1, { message: "Subject is required" }),
    message: z.string().min(5, { message: "Message is too short" }),
})

const formSchema = z.object({
    ...basicInfoSchema.shape,
    ...messageSchema.shape,
})

type FormValues = z.infer<typeof formSchema>

export default function CreateProductNew() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    <span>Create Product</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <MultiStepFormDemo />
            </DialogContent>
        </Dialog>
    )
}

function MultiStepFormDemo() {
    const [, setResult] = useState<FormValues | null>(null)

    const initialValues: Partial<FormValues> = {
        name: '',
        url: '',
        subject: '',
        message: ''
    };

    const handleComplete = (data: FormValues) => {
        setResult(data)
        toast.success("Form submitted!")
    }

    return (
        <MultiStepFormWrapper
            onComplete={handleComplete}
            completeButtonText="Submit"
            className="w-full"
            schema={formSchema}
            initialData={initialValues}
            allowStepReset
        >
            <Step
                title="Basic Info"
                schema={basicInfoSchema}
            >
                <BasicInfoStep />
            </Step>
            <Step
                title="Message"
                schema={messageSchema}
            >
                <MessageStep />
            </Step>
        </MultiStepFormWrapper>
    );
}

function BasicInfoStep() {
    const { form } = useMultiStepForm<FormValues>()

    return (
        <Form {...form}>
            <div className="space-y-3">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Enter your name"
                                    startContent={<Box />}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="url"
                                    placeholder="Enter your URL"
                                    inputMode="url"
                                    startContent={<Globe />}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </Form>
    )
}

function MessageStep() {
    const { form } = useMultiStepForm<FormValues>()

    return (
        <Form {...form}>
            <div className="space-y-3">
                <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Message subject"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Type your message here"
                                    className="w-full p-2 text-sm border rounded min-h-[80px]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </Form>
    )
}