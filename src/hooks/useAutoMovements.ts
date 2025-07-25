import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '@/api/inventory';
import { AutoMovementData } from '@/types/inventory';
import { toast } from 'sonner';

// Hook para generar movimientos automáticos
export const useGenerateAutoMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movementData: AutoMovementData) => {
      // Crear el movimiento usando la interfaz InventoryMovement
      const response = await inventoryApi.createMovement({
        product_id: movementData.product_id,
        batch_id: movementData.batch_id,
        movement_type: movementData.type,
        quantity: movementData.quantity,
        unit_cost: movementData.unit_cost,
        reason: movementData.reason,
        reference_document: movementData.reference_document,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      toast.error(`Error al generar movimiento automático: ${error.message}`);
    }
  });
};

// Hook para generar movimiento de venta
export const useGenerateSaleMovement = () => {
  const generateMovement = useGenerateAutoMovement();
  
  return useMutation({
    mutationFn: async (saleData: {
      product_id: number;
      batch_id?: number;
      quantity: number;
      unit_cost: number;
      location_from_id?: number;
      sale_id: number;
      reference_document: string;
    }) => {
      return generateMovement.mutateAsync({
        product_id: saleData.product_id,
        batch_id: saleData.batch_id,
        type: 'exit',
        subtype: 'sale',
        quantity: saleData.quantity,
        unit_cost: saleData.unit_cost,
        location_from_id: saleData.location_from_id,
        reason: 'Venta de producto',
        reference_document: saleData.reference_document,
        source_type: 'sale',
        source_id: saleData.sale_id,
        notes: `Venta automática - Referencia: ${saleData.reference_document}`,
        is_automatic: true,
      });
    }
  });
};

// Hook para generar movimiento de recepción/compra
export const useGenerateReceiptMovement = () => {
  const generateMovement = useGenerateAutoMovement();
  
  return useMutation({
    mutationFn: async (receiptData: {
      product_id: number;
      batch_id?: number;
      quantity: number;
      unit_cost: number;
      location_to_id?: number;
      supplier_id?: number;
      reference_document?: string;
    }) => {
      return generateMovement.mutateAsync({
        product_id: receiptData.product_id,
        batch_id: receiptData.batch_id,
        type: 'entry',
        subtype: 'receipt',
        quantity: receiptData.quantity,
        unit_cost: receiptData.unit_cost,
        location_to_id: receiptData.location_to_id,
        reason: 'Recepción de producto de proveedor',
        reference_document: receiptData.reference_document,
        source_type: 'receipt',
        notes: `Recepción automática de proveedor`,
        is_automatic: true,
      });
    }
  });
};

// Hook para generar movimiento de transferencia
export const useGenerateTransferMovement = () => {
  const generateMovement = useGenerateAutoMovement();
  
  return useMutation({
    mutationFn: async (transferData: {
      product_id: number;
      batch_id?: number;
      quantity: number;
      location_from_id: number;
      location_to_id: number;
      reference_document?: string;
      reason?: string;
    }) => {
      return generateMovement.mutateAsync({
        product_id: transferData.product_id,
        batch_id: transferData.batch_id,
        type: 'transfer',
        subtype: 'transfer',
        quantity: transferData.quantity,
        location_from_id: transferData.location_from_id,
        location_to_id: transferData.location_to_id,
        reason: transferData.reason || 'Transferencia entre ubicaciones',
        reference_document: transferData.reference_document,
        source_type: 'transfer',
        notes: 'Transferencia automática entre ubicaciones',
        is_automatic: true,
      });
    }
  });
};