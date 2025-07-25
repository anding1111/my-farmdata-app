import { Button } from "@/components/ui/button";
import { 
  Download, 
  FileSpreadsheet, 
  FileText,
  Loader2
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from "sonner";

interface ExportButtonsProps {
  data: any[];
  reportTitle: string;
  chartRef?: React.RefObject<HTMLDivElement>;
  isLoading?: boolean;
  fileName?: string;
  columns?: { key: string; label: string; format?: (value: any) => string }[];
}

const ExportButtons = ({ 
  data, 
  reportTitle, 
  chartRef, 
  isLoading = false,
  fileName,
  columns = []
}: ExportButtonsProps) => {
  
  const generateFileName = (extension: string) => {
    const baseFileName = fileName || reportTitle.toLowerCase().replace(/\s+/g, '_');
    const timestamp = new Date().toISOString().split('T')[0];
    return `${baseFileName}_${timestamp}.${extension}`;
  };

  const exportToExcel = () => {
    try {
      if (!data || data.length === 0) {
        toast.error("No hay datos para exportar");
        return;
      }

      // Prepare data for Excel
      const processedData = data.map(item => {
        const processedItem: any = {};
        if (columns.length > 0) {
          columns.forEach(col => {
            const value = item[col.key];
            processedItem[col.label] = col.format ? col.format(value) : value;
          });
        } else {
          // If no columns specified, export all data
          Object.keys(item).forEach(key => {
            processedItem[key] = item[key];
          });
        }
        return processedItem;
      });

      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(processedData);

      // Auto-adjust column width
      const colWidths = Object.keys(processedData[0] || {}).map(key => ({
        wch: Math.max(
          key.length,
          ...processedData.map(row => String(row[key] || '').length)
        )
      }));
      ws['!cols'] = colWidths;

      // Add title
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
      
      // Save file
      XLSX.writeFile(wb, generateFileName('xlsx'));
      toast.success("Reporte exportado a Excel exitosamente");
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error("Error al exportar a Excel");
    }
  };

  const exportToPDF = async () => {
    try {
      if (!data || data.length === 0) {
        toast.error("No hay datos para exportar");
        return;
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Add title
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(reportTitle, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Add generation date
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const currentDate = new Date().toLocaleDateString('es-ES');
      pdf.text(`Generado el: ${currentDate}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Add chart if available
      if (chartRef?.current) {
        try {
          const canvas = await html2canvas(chartRef.current, {
            backgroundColor: '#ffffff',
            scale: 2,
            logging: false,
            useCORS: true
          });
          
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pageWidth - (margin * 2);
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          // Check if image fits on current page
          if (yPosition + imgHeight > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          
          pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 15;
        } catch (error) {
          console.warn('Could not capture chart:', error);
        }
      }

      // Add data table
      if (data.length > 0) {
        // Check if we need a new page for the table
        if (yPosition > pageHeight - 100) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Datos del Reporte', margin, yPosition);
        yPosition += 10;

        // Table headers
        const tableColumns = columns.length > 0 ? columns : 
          Object.keys(data[0]).map(key => ({ key, label: key }));
        
        const colWidth = (pageWidth - (margin * 2)) / tableColumns.length;
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        
        tableColumns.forEach((col, index) => {
          pdf.text(
            col.label, 
            margin + (index * colWidth) + 2, 
            yPosition,
            { maxWidth: colWidth - 4 }
          );
        });
        yPosition += 8;

        // Table data
        pdf.setFont('helvetica', 'normal');
        data.forEach((row, rowIndex) => {
          if (yPosition > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
            
            // Repeat headers on new page
            pdf.setFont('helvetica', 'bold');
            tableColumns.forEach((col, index) => {
              pdf.text(
                col.label, 
                margin + (index * colWidth) + 2, 
                yPosition,
                { maxWidth: colWidth - 4 }
              );
            });
            yPosition += 8;
            pdf.setFont('helvetica', 'normal');
          }

          tableColumns.forEach((col, index) => {
            const value = row[col.key];
            const formattedValue = (col as any).format ? (col as any).format(value) : String(value || '');
            pdf.text(
              formattedValue, 
              margin + (index * colWidth) + 2, 
              yPosition,
              { maxWidth: colWidth - 4 }
            );
          });
          yPosition += 6;
        });
      }

      // Save PDF
      pdf.save(generateFileName('pdf'));
      toast.success("Reporte exportado a PDF exitosamente");
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error("Error al exportar a PDF");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={isLoading || !data || data.length === 0}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToExcel}>
          <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
          Exportar a Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="h-4 w-4 mr-2 text-red-600" />
          Exportar a PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButtons;