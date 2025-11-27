"use client"

import { BarcodeScanner } from '@thewirv/react-barcode-scanner'
import { Camera, X, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

import type { BarcodeScannerCammeraButtonProps } from '@/features/sale/types'
import { Alert, AlertDescription } from '@/features/shadcn/components/ui/alert'
import { Button } from '@/features/shadcn/components/ui/button'
import { cn } from '@/lib/utils'

function BarcodeScannerCammeraButton({ onProductScanned }: BarcodeScannerCammeraButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [hasCamera, setHasCamera] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkCamera = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setHasCamera(videoDevices.length > 0);
            } catch (err) {
                console.error('Error checking camera:', err);
                setHasCamera(false);
            }
        };

        checkCamera();
    }, []);

    const handleOpen = async () => {
        if (hasCamera === false) {
            setError('No se detectó ninguna cámara. Por favor, conecta una cámara y recarga la página.');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            setIsOpen(true);
            setError(null);
        } catch (err) {
            console.error('Error accessing camera:', err);
            setError('No se pudo acceder a la cámara. Verifica los permisos o conecta una cámara.');
        }
    }

    const handleClose = () => {
        setIsOpen(false);
    }

    const handleScan = (text: string) => {
        onProductScanned?.(text);
        handleClose();
    }

    return (
        <>
            <Button 
                variant="outline" 
                size="icon" 
                onClick={handleOpen}
                disabled={hasCamera === null}
                className={cn(
                    hasCamera === false && "border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20"
                )}
            >
                <Camera />
            </Button>

            {error && (
                <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md mx-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="flex items-start justify-between gap-2">
                            <span className="flex-1">{error}</span>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setError(null)}
                                className="h-6 w-6 p-0 shrink-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {isOpen && (
                <div className='fixed top-0 left-0 right-0 bottom-0 z-50' onClick={handleClose}>
                    <Button variant="outline" size="icon" onClick={handleClose} className='absolute top-4 right-4 z-[100]'>
                        <X />
                    </Button>
                    <BarcodeScanner
                        doScan
                        onSuccess={handleScan}
                        onError={(error) => {
                            if (error) {
                                console.error(error.message);
                                setError('Error al escanear: ' + error.message);
                                handleClose();
                            }
                        }}
                        onLoad={() => console.log('Video feed has loaded!')}
                        containerStyle={{ width: '100%', height: '100%', zIndex: 1000, backdropFilter: "blur(10px)" }}
                        videoContainerStyle={{ width: '100%', height: '100%', padding: 0, display: "flex", justifyContent: "center", alignItems: "center" }}
                        constraints={{ aspectRatio: 16 / 9 }}
                        videoStyle={{ width: "89%", position: "static", height: "80%", borderRadius: "20px" }}
                    />
                </div>
            )}
        </>
    );
}

export { BarcodeScannerCammeraButton }