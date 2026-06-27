'use client';

import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';

export default function DownloadInvoiceButton({ invoiceName }: { invoiceName: string }) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    const element = document.getElementById('invoice-content');
    if (!element) {
      setIsGeneratingPDF(false);
      return;
    }
    
    // Add a temporary class to ensure light mode styles are forced during render
    // if we had dark mode defaults, but since it's already forced bg-white text-gray-900 we are good.
    try {
      const imgData = await htmlToImage.toPng(element, { pixelRatio: 2, backgroundColor: '#ffffff' });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => { img.onload = resolve; });
      
      const margin = 10;
      const effectiveWidth = pdfWidth - margin * 2;
      const pdfHeight = (img.height * effectiveWidth) / img.width;
      
      let position = margin;
      let heightLeft = pdfHeight;
      
      pdf.addImage(imgData, 'PNG', margin, position, effectiveWidth, pdfHeight);
      heightLeft -= (pageHeight - margin * 2);
      
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, effectiveWidth, pdfHeight);
        heightLeft -= (pageHeight - margin * 2);
      }
      
      pdf.save(`Invoice-${invoiceName}.pdf`);
    } catch (err: any) {
      console.error('Failed to generate PDF', err);
      alert('Failed to generate PDF');
    }
    setIsGeneratingPDF(false);
  };

  return (
    <button 
      onClick={handleDownloadPDF}
      disabled={isGeneratingPDF}
      className="flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20 disabled:opacity-50"
    >
      <FileText className="h-4 w-4" />
      {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
    </button>
  );
}
