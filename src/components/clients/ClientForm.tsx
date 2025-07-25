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
import { ClientFormData, DOCUMENT_TYPE_OPTIONS, CLIENT_STATUS_OPTIONS, COLOMBIA_DEPARTMENTS } from "@/types/clients";

const clientSchema = z.object({
  code: z.string().min(1, "El código es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  document_type: z.enum(["CC", "TI", "CE", "PP", "NIT"]),
  document_number: z.string().min(1, "El número de documento es requerido"),
  birth_date: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  department: z.string().optional(),
  emergency_contact: z.string().optional(),
  emergency_phone: z.string().optional(),
  insurance_provider: z.string().optional(),
  insurance_number: z.string().optional(),
  allergies: z.string().optional(),
  medical_conditions: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["active", "inactive"])
});

interface ClientFormProps {
  initialData?: Partial<ClientFormData>;
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ClientForm = ({ initialData, onSubmit, onCancel, isLoading }: ClientFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      status: "active",
      document_type: "CC",
      ...initialData
    }
  });

  const watchedDocumentType = watch("document_type");
  const watchedDepartment = watch("department");

  const handleFormSubmit = async (data: ClientFormData) => {
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
                  placeholder="CLI-001"
                />
                {errors.code && (
                  <p className="text-sm text-destructive">{errors.code.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(value) => setValue("status", value as "active" | "inactive")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLIENT_STATUS_OPTIONS.map((option) => (
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
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Nombre completo del cliente"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="document_type">Tipo de Documento *</Label>
                <Select
                  value={watchedDocumentType}
                  onValueChange={(value) => setValue("document_type", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.document_type && (
                  <p className="text-sm text-destructive">{errors.document_type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="document_number">Número de Documento *</Label>
                <Input
                  id="document_number"
                  {...register("document_number")}
                  placeholder="Número de documento"
                />
                {errors.document_number && (
                  <p className="text-sm text-destructive">{errors.document_number.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
              <Input
                id="birth_date"
                type="date"
                {...register("birth_date")}
              />
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="cliente@email.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="+57 300 123 4567"
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

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Contacto de Emergencia</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact">Nombre</Label>
                  <Input
                    id="emergency_contact"
                    {...register("emergency_contact")}
                    placeholder="Nombre del contacto"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_phone">Teléfono</Label>
                  <Input
                    id="emergency_phone"
                    {...register("emergency_phone")}
                    placeholder="+57 300 987 6543"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información Médica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Médica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insurance_provider">EPS/Seguro</Label>
                <Input
                  id="insurance_provider"
                  {...register("insurance_provider")}
                  placeholder="Nombre de la EPS"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insurance_number">Número de Afiliación</Label>
                <Input
                  id="insurance_number"
                  {...register("insurance_number")}
                  placeholder="Número de afiliación"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Alergias</Label>
              <Textarea
                id="allergies"
                {...register("allergies")}
                placeholder="Alergias conocidas (medicamentos, alimentos, etc.)"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical_conditions">Condiciones Médicas</Label>
              <Textarea
                id="medical_conditions"
                {...register("medical_conditions")}
                placeholder="Condiciones médicas relevantes"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notas Adicionales */}
        <Card>
          <CardHeader>
            <CardTitle>Notas Adicionales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Notas adicionales sobre el cliente"
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
          {isLoading ? "Guardando..." : "Guardar"} Cliente
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;