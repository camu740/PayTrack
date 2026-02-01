import jsPDF from 'jspdf';
import { format } from 'date-fns';

export const generatePaymentReport = (debtData, payments, totalPaid) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Informe de Pagos', 105, 20, { align: 'center' });

    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generado: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 105, 28, { align: 'center' });

    // Divider line
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32);

    // Summary section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen', 20, 42);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const totalDebt = debtData.totalAmount || 0;
    const percentage = totalDebt > 0 ? ((totalPaid / totalDebt) * 100).toFixed(2) : 0;

    doc.text(`Total a pagar: €${totalDebt.toFixed(2)}`, 20, 52);
    doc.text(`Total pagado: €${totalPaid.toFixed(2)}`, 20, 60);
    doc.text(`Porcentaje pagado: ${percentage}%`, 20, 68);
    doc.text(`Pendiente: €${(totalDebt - totalPaid).toFixed(2)}`, 20, 76);

    // Payments list section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Historial de Transferencias', 20, 90);

    if (payments.length === 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('No hay transferencias registradas', 20, 100);
    } else {
        // Table headers
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Fecha', 20, 100);
        doc.text('Importe', 90, 100);
        doc.text('Concepto', 130, 100);

        // Table line
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(20, 102, 190, 102);

        // Table rows
        doc.setFont('helvetica', 'normal');
        let yPosition = 110;

        payments.forEach((payment, index) => {
            // Check if we need a new page
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }

            const dateStr = payment.createdAt
                ? format(payment.createdAt, 'dd/MM/yyyy')
                : 'N/A';

            doc.text(dateStr, 20, yPosition);
            doc.text(`€${payment.amount.toFixed(2)}`, 90, yPosition);
            doc.text(payment.concept || '-', 130, yPosition, { maxWidth: 60 });

            yPosition += 8;
        });
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
            `Página ${i} de ${pageCount}`,
            105,
            290,
            { align: 'center' }
        );
    }

    // Return the PDF as a blob instead of saving directly
    return doc.output('blob');
};

// Function to share PDF via Web Share API
export const sharePaymentReport = async (debtData, payments, totalPaid) => {
    try {
        const pdfBlob = generatePaymentReport(debtData, payments, totalPaid);
        const fileName = `informe-pagos-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.pdf`;

        // Create a File from the blob
        const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

        // Check if Web Share API is supported and can share files
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'Informe de Pagos - PayTrack',
                text: `Informe de pagos generado el ${format(new Date(), 'dd/MM/yyyy')}`
            });
            return { success: true, shared: true };
        } else {
            // Fallback: download the file
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(url);
            return { success: true, shared: false, message: 'PDF descargado (compartir no disponible en este navegador)' };
        }
    } catch (error) {
        console.error('Error sharing PDF:', error);
        return { success: false, error: error.message };
    }
};

// Legacy function for direct download
export const downloadPaymentReport = (debtData, payments, totalPaid) => {
    const pdfBlob = generatePaymentReport(debtData, payments, totalPaid);
    const fileName = `informe-pagos-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.pdf`;

    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
};
