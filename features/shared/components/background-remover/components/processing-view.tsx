import { Loader2 } from 'lucide-react'
import { ProcessingViewProps } from '../types'

export function ProcessingView({ progress }: ProcessingViewProps) {
    return (
        <div className="space-y-4 py-8">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
                <div className="text-center space-y-2">
                    <p className="font-medium">Procesando imagen con IA...</p>
                    <p className="text-sm text-muted-foreground">
                        Esto puede tomar unos segundos
                    </p>
                </div>
                <div className="w-full max-w-xs">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                        {progress}%
                    </p>
                </div>
            </div>
        </div>
    )
}