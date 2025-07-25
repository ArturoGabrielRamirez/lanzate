"use client"
import { useState } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";


function BarcodeScannerButton() {

    const [data, setData] = useState<string>("")

    return (
        <div>

            <BarcodeScanner
                width={500}
                height={500}
                videoConstraints={{
                    
                }}
                onUpdate={(err, result) => {
                    console.log(result)
                    console.log(err)
                    if (result) setData(result.text);
                    else setData("Not Found");
                }}
                onError={(err) => {
                    console.error(err)
                }}
            />
            <p>{data}</p>
        </div>
    )
}
export default BarcodeScannerButton