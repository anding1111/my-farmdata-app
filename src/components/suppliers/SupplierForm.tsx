import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SupplierFormData, TAX_TYPE_OPTIONS, SUPPLIER_STATUS_OPTIONS, ACCOUNT_TYPE_OPTIONS, SUPPLIER_CATEGORIES, RATING_OPTIONS, COLOMBIA_DEPARTMENTS } from "@/types/suppliers";

const supplierSchema = z.object({
  code: z.string().min(1, "El código es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  company_name: z.string().optional(),
  contact_person: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  department: z.string().optional(),
  country: z.string().optional(),
  tax_id: z.string().optional(),
  tax_type: z.enum(["RUT", "NIT", "CC", "CE"]),
  website: z.string().optional(),
  bank_name: z.string().optional(),
  bank_account: z.string().optional(),
  account_type: z.enum(["savings", "checking"]).optional(),
  payment_terms: z.string().optional(),
  credit_limit: z.number().min(0, "Debe ser mayor a 0").optional(),
  rating: z.number().min(1).max(5).optional(),
  supplier_category: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["active", "inactive", "suspended"])
});

interface SupplierFormProps {
  initialData?: Partial<SupplierFormData>;
  onSubmit: (data: SupplierFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const SupplierForm = ({ initialData, onSubmit, onCancel, isLoading }: SupplierFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      status: "active",
      tax_type: "NIT",
      country: "Colombia",
      ...initialData
    }
  });

  const watchedTaxType = watch("tax_type");
  const watchedDepartment = watch("department");
  const watchedStatus = watch("status");
  const watchedAccountType = watch("account_type");
  const watchedCategory = watch("supplier_category");
  const watchedRating = watch("rating");

  const handleFormSubmit = async (data: SupplierFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  {...register("code")}
                  placeholder="PROV-001"
                />
                {errors.code && (
                  <p className="text-sm text-destructive">{errors.code.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select
                  value={watchedStatus}
                  onValueChange={(value) => setValue("status", value as "active" | "inactive" | "suspended")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPLIER_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-destructive">{errors.status.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nombre/Razón Social *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Nombre completo o razón social"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Nombre Comercial</Label>
              <Input
                id="company_name"
                {...register("company_name")}
                placeholder="Nombre comercial (si aplica)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier_category">Categoría</Label>
                <Select
                  value={watchedCategory || ""}
                  onValueChange={(value) => setValue("supplier_category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPLIER_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Calificación</Label>
                <Select
                  value={watchedRating?.toString() || ""}
                  onValueChange={(value) => setValue("rating", value ? parseInt(value) as 1 | 2 | 3 | 4 | 5 : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sin calificación" />
                  </SelectTrigger>
                  <SelectContent>
                    {RATING_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de Contacto */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact_person">Persona de Contacto</Label>
              <Input
                id="contact_person"
                {...register("contact_person")}
                placeholder="Nombre del contacto principal"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="+57 1 234 5678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Celular</Label>
                <Input
                  id="mobile"
                  {...register("mobile")}
                  placeholder="+57 300 123 4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="proveedor@email.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Sitio Web</Label>
              <Input
                id="website"
                {...register("website")}
                placeholder="www.proveedor.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea
                id="address"
                {...register("address")}
                placeholder="Dirección completa"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Select
                  value={watchedDepartment || ""}
                  onValueChange={(value) => setValue("department", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {COLOMBIA_DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  {...register("city")}
                  placeholder="Ciudad"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información Tributaria */}
        <Card>
          <CardHeader>
            <CardTitle>Información Tributaria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tax_type">Tipo de Documento *</Label>
                <Select
                  value={watchedTaxType}
                  onValueChange={(value) => setValue("tax_type", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {TAX_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tax_type && (
                  <p className="text-sm text-destructive">{errors.tax_type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax_id">Número de Identificación</Label>
                <Input
                  id="tax_id"
                  {...register("tax_id")}
                  placeholder="Número de identificación tributaria"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                {...register("country")}
                placeholder="País"
              />
            </div>
          </CardContent>
        </Card>

        {/* Información Financiera */}
        <Card>
          <CardHeader>
            <CardTitle>Información Financiera</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment_terms">Términos de Pago</Label>
              <Input
                id="payment_terms"
                {...register("payment_terms")}
                placeholder="ej: 30 días, Contado, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credit_limit">Límite de Crédito</Label>
              <Input
                id="credit_limit"
                type="number"
                {...register("credit_limit", { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.credit_limit && (
                <p className="text-sm text-destructive">{errors.credit_limit.message}</p>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Información Bancaria</h4>
              <div className="space-y-2">
                <Label htmlFor="bank_name">Banco</Label>
                <Input
                  id="bank_name"
                  {...register("bank_name")}
                  placeholder="Nombre del banco"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bank_account">Número de Cuenta</Label>
                  <Input
                    id="bank_account"
                    {...register("bank_account")}
                    placeholder="Número de cuenta"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account_type">Tipo de Cuenta</Label>
                  <Select
                    value={watchedAccountType || ""}
                    onValueChange={(value) => setValue("account_type", value as "savings" | "checking")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACCOUNT_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notas Adicionales */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Notas Adicionales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Notas adicionales sobre el proveedor"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar"} Proveedor
        </Button>
      </div>
    </form>
  );
};

export default SupplierForm;