"use client"
import { useState } from 'react';
import { BarcodeScanner } from '@thewirv/react-barcode-scanner';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';

type BarcodeScannerCammeraButtonProps = {
    onProductScanned?: (barcode: string) => void
}

function BarcodeScannerCammeraButton({ onProductScanned }: BarcodeScannerCammeraButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
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
            <Button variant="outline" size="icon" onClick={handleOpen}>
                <Camera />
            </Button>
            {isOpen && (
                <div className='fixed top-0 left-0 right-0 bottom-0 z-50' onClick={handleClose}>
                    <Button variant="outline" size="icon" onClick={handleClose} className='absolute top-4 right-4 z-100'>
                        <X />
                    </Button>
                    <BarcodeScanner
                        doScan
                        onSuccess={handleScan}
                        onError={(error) => {
                            if (error) {
                                console.error(error.message);
                            }
                        }}
                        onLoad={() => console.log('Video feed has loaded!')}
                        containerStyle={{ width: '100%', height: '100%', zIndex: 1000, backdropFilter: "blur(10px)" }}
                        videoContainerStyle={{ width: '100%', height: '100%', padding: 0, display: "flex", justifyContent: "center", alignItems: "center" }}
                        constraints={{ aspectRatio: 16 / 9 }}
                        videoStyle={{ width: "89%", position: "static" , height : "80%", borderRadius : "20px"}}
                    />
                </div>
            )}
        </>
    );
}

export default BarcodeScannerCammeraButton