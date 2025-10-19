import { Settings, AppWindow, Filter, IdCard } from "lucide-react"
import * as motion from "motion/react-client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"

function StylesSkeleton() {
    return (
        <motion.div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-6 w-full grow">
            {/* Settings Panel - Left Side */}
            <motion.div 
                className="space-y-6"
            >
                {/* Accordion Sections */}
                <Accordion type="single" collapsible>
                    {/* General Configuration */}
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            <span className="flex items-center gap-2">
                                <Settings className="size-4" />
                                Configuración general
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4">
                            {/* Color Selectors */}
                            <motion.div 
                                className="space-y-2"
                            >
                                <Skeleton className="h-4 w-24" />
                                <div className="flex items-center gap-2">
                                    <Skeleton className="size-10 rounded-lg" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                className="space-y-2"
                            >
                                <Skeleton className="h-4 w-32" />
                                <div className="flex items-center gap-2">
                                    <Skeleton className="size-10 rounded-lg" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </motion.div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Header Configuration */}
                    <AccordionItem value="item-2">
                        <AccordionTrigger>
                            <span className="flex items-center gap-2">
                                <AppWindow className="size-4" />
                                Configuración de cabecera
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4">
                            {/* Color Selectors */}
                            {Array.from({ length: 2 }).map((_, index) => (
                                <motion.div 
                                    key={index}
                                    className="space-y-2"
                                >
                                    <Skeleton className="h-4 w-28" />
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="size-10 rounded-lg" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </motion.div>
                            ))}
                            
                            {/* Switch Selectors */}
                            {Array.from({ length: 3 }).map((_, index) => (
                                <motion.div 
                                    key={index}
                                    className="flex items-center justify-between"
                                >
                                    <Skeleton className="h-4 w-32" />
                                    <Switch disabled />
                                </motion.div>
                            ))}
                            
                            {/* Select Selector */}
                            <motion.div 
                                className="space-y-2"
                            >
                                <Skeleton className="h-4 w-28" />
                                <Select disabled>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Mediana" />
                                    </SelectTrigger>
                                </Select>
                            </motion.div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Filters Configuration */}
                    <AccordionItem value="item-3">
                        <AccordionTrigger>
                            <span className="flex items-center gap-2">
                                <Filter className="size-4" />
                                Configuración de filtros
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4">
                            {/* Color Selectors */}
                            {Array.from({ length: 2 }).map((_, index) => (
                                <motion.div 
                                    key={index}
                                    className="space-y-2"
                                >
                                    <Skeleton className="h-4 w-36" />
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="size-10 rounded-lg" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </motion.div>
                            ))}
                            
                            {/* Switch Selectors */}
                            {Array.from({ length: 5 }).map((_, index) => (
                                <motion.div 
                                    key={index}
                                    className="flex items-center justify-between"
                                >
                                    <Skeleton className="h-4 w-40" />
                                    <Switch disabled />
                                </motion.div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>

                    {/* Products Configuration */}
                    <AccordionItem value="item-4">
                        <AccordionTrigger>
                            <span className="flex items-center gap-2">
                                <IdCard className="size-4" />
                                Configuración de productos
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4">
                            {/* Color Selectors */}
                            {Array.from({ length: 2 }).map((_, index) => (
                                <motion.div 
                                    key={index}
                                    className="space-y-2"
                                >
                                    <Skeleton className="h-4 w-32" />
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="size-10 rounded-lg" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </motion.div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Save Button */}
                <motion.div
                >
                    <Button disabled className="w-full">
                        <Skeleton className="h-4 w-24" />
                    </Button>
                </motion.div>
            </motion.div>

            {/* Store Preview - Right Side */}
            <motion.div 
                className="space-y-4"
            >
                <Card className="p-4 space-y-4">
                    {/* Header Preview */}
                    <motion.div 
                        className="space-y-3"
                    >
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-8 rounded" />
                                <Skeleton className="h-6 w-32" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="size-8 rounded-full" />
                                <Skeleton className="size-8 rounded-full" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content Preview */}
                    <motion.div 
                        className="space-y-4"
                    >
                        {/* Title */}
                        <Skeleton className="h-8 w-24" />
                        
                        {/* Grid Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-4">
                            {/* Sidebar Filters */}
                            <motion.div 
                                className="space-y-3"
                            >
                                <Card className="p-3 space-y-3">
                                    <Skeleton className="h-5 w-16" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-10 w-full" />
                                        <div className="space-y-1">
                                            {Array.from({ length: 3 }).map((_, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <Skeleton className="size-4 rounded" />
                                                    <Skeleton className="h-4 w-20" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                            
                            {/* Product Grid */}
                            <motion.div 
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                            >
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <motion.div
                                        key={index}
                                    >
                                        <Card className="p-3 space-y-2">
                                            <Skeleton className="aspect-square w-full rounded" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-16" />
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </Card>
            </motion.div>
        </motion.div>
    )
}

export { StylesSkeleton }