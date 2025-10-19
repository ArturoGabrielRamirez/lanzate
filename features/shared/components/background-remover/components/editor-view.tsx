import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CompareView } from './compare-view'
import { EditorViewProps } from '../types'
import { EditView } from '@/features/shared/components/background-remover/components/index'

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
