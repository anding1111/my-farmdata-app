import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, FileSpreadsheet, File, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ReportFilter, ReportExportOptions, EXPORT_FORMATS } from "@/types/reports";
import { reportsApi } from "@/api/reports";

interface ReportExportProps {
  reportType: string;
  filters: ReportFilter;
  data: any;
}

const ReportExport = ({ reportType, filters, data }: ReportExportProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ReportExportOptions>({
    format: 'pdf',
    include_charts: true,
    include_details: true
  });
  const { toast } = useToast();

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'excel':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'csv':
        return <File className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const result = await reportsApi.exportReport(reportType, filters, exportOptions);
      
      // Simular descarga del archivo
      const link = document.createElement('a');
      link.href = result.download_url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Reporte exportado",
        description: `El reporte se ha exportado exitosamente como ${exportOptions.format.toUpperCase()}.`,
      });
      
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error al exportar",
        description: error instanceof Error ? error.message : "Ha ocurrido un error al exportar el reporte",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getEstimatedSize = () => {
    let baseSize = 0.5; // MB base
    
    if (exportOptions.include_charts) baseSize += 1.2;
    if (exportOptions.include_details) baseSize += 0.8;
    if (exportOptions.format === 'excel') baseSize += 0.3;
    
    return baseSize.toFixed(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Reporte
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Exportar Reporte</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información del Reporte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-medium capitalize">{reportType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Período:</span>
                <span className="font-medium">
                  {filters.start_date} - {filters.end_date}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tamaño estimado:</span>
                <span className="font-medium">{getEstimatedSize()} MB</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="format">Formato de exportación</Label>
              <Select
                value={exportOptions.format}
                onValueChange={(value) => setExportOptions(prev => ({ ...prev, format: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar formato" />
                </SelectTrigger>
                <SelectContent>
                  {EXPORT_FORMATS.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      <div className="flex items-center gap-2">
                        {getFormatIcon(format.value)}
                        {format.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Contenido a incluir</Label>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include_charts"
                  checked={exportOptions.include_charts}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, include_charts: checked as boolean }))
                  }
                />
                <Label htmlFor="include_charts" className="text-sm">
                  Incluir gráficos y visualizaciones
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include_details"
                  checked={exportOptions.include_details}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, include_details: checked as boolean }))
                  }
                />
                <Label htmlFor="include_details" className="text-sm">
                  Incluir tablas detalladas
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="gap-2"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Exportar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportExport;