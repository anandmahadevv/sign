'use client';

import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
const SignatureCanvasAny = SignatureCanvas as any;
import { RotateCcw, CheckCircle2 } from 'lucide-react';

export default function SignaturePad({ onSign }: { onSign: (signature: string) => void }) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [signed, setSigned] = useState(false);

  const clear = () => {
    sigCanvas.current?.clear();
    setSigned(false);
  };

  const handleSign = () => {
    if (sigCanvas.current?.isEmpty()) {
      alert('Please provide a signature first.');
      return;
    }
    const dataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
    if (dataUrl) {
      setSigned(true);
      onSign(dataUrl);
    }
  };

  if (signed) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#28c840] bg-[#28c840]/5 p-8">
        <CheckCircle2 className="mb-2 h-8 w-8 text-[#28c840]" />
        <p className="font-semibold text-[#28c840]">Signature Captured</p>
        <p className="text-sm text-gray-500">Thank you for signing this agreement.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">Draw your signature below</p>
        <button
          onClick={clear}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900"
        >
          <RotateCcw className="h-3 w-3" />
          Clear
        </button>
      </div>
      
      <div className="rounded-md border border-gray-300 bg-white">
        <SignatureCanvasAny
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            className: 'signature-canvas w-full h-40 rounded-md cursor-crosshair',
          }}
        />
      </div>
      
      <p className="mt-2 text-xs text-gray-500 text-center mb-4">
        By signing above, I agree to the terms outlined in this document.
      </p>

      <button
        onClick={handleSign}
        className="w-full rounded-md bg-black px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800"
      >
        Accept & Sign
      </button>
    </div>
  );
}
