import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/features/shadcn/components/ui/tabs'
import { CompareView, EditView } from '@/features/global/components/background-remover'
import { EditorViewProps } from '@/features/shared/types'

export function EditorView({ originalUrl, editor }: EditorViewProps) {
    return (
        <>
            <div className="hidden">
                <canvas ref={editor.canvasRef} />
                <canvas ref={editor.compareCanvasRef} />
            </div>

            <Tabs defaultValue="compare" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="compare">Comparar</TabsTrigger>
                    <TabsTrigger value="edit">Editar Detalles</TabsTrigger>
                </TabsList>

                <TabsContent value="compare">
                    <CompareView
                        originalUrl={originalUrl}
                        editor={editor}
                    />
                </TabsContent>

                <TabsContent value="edit">
                    <EditView editor={editor} />
                </TabsContent>
            </Tabs>
        </>
    )
}
