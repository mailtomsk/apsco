import React, { useEffect, useRef, useState } from 'react';
import {
    Html5Qrcode,
    Html5QrcodeScanner,
    Html5QrcodeSupportedFormats,
    CameraDevice
} from 'html5-qrcode';

interface QRScannerProps {
    onResult: (serial: string) => void;
    assetScanned: boolean;
}

const QRScanner: React.FC<QRScannerProps> = ({ onResult, assetScanned }) => {
    const readerId = 'reader';
    const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
    const [showScanAgain, setShowScanAgain] = useState(false);
    const [cameraName, setCameraName] = useState<string | null>(null);
    const readerRef = useRef<HTMLDivElement | null>(null);

    const startScanner = async () => {
        if (scanner) {
            await scanner.stop();
            scanner.clear(); // <-- clears the UI
        }

        const html5QrCode = new Html5Qrcode(readerId, {
            verbose: false,
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        });

        setScanner(html5QrCode);

        try {
            const cameras = await Html5Qrcode.getCameras();
            if (cameras.length > 0) {
                const selectedCamera = cameras[1] || cameras[0];
                setCameraName(selectedCamera.label);

                await html5QrCode.start(
                    selectedCamera.id,
                    { fps: 10, qrbox: 200 },
                    (decodedText) => {
                        html5QrCode.stop().then(() => {
                            html5QrCode.clear(); // make sure DOM is reset
                            setShowScanAgain(true);
                            onResult(decodedText);
                        });
                    }
                );

                setTimeout(() => {
                    readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        } catch (err) {
            console.error("Camera error:", err);
        }
    };

    const handleScanAgain = () => {
        setShowScanAgain(false);
        setCameraName(null);
        startScanner();

        setTimeout(() => {
            readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    };

    useEffect(() => {
        if (!assetScanned) {
            startScanner();
        }

        return () => {
            scanner?.stop().then(() => {
                scanner.clear();
            }).catch((e) => console.error("Cleanup stop error:", e));
        };
    }, []);

    return (
        <div className="text-center mb-4">
            {cameraName && (
                <p className="text-sm text-gray-400 mb-2">
                    Camera: <span className="font-medium text-white">{cameraName}</span>
                </p>
            )}

            <div className="mb-4">
                <div
                    id={readerId}
                    ref={readerRef}
                    className={showScanAgain || assetScanned ? 'hidden' : ''}
                />
            </div>

            {showScanAgain && (
                <div id="scan-again-wrapper" className="text-center">
                    <button
                        onClick={handleScanAgain}
                        className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition duration-300"
                    >
                        Scan Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default QRScanner;
