
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const Settings = () => {
  return (
    <DashboardLayout>
      <DashboardHeader title="Configuración" />
      <div className="p-6">
        <p className="text-lg">Contenido del módulo de configuración se desarrollará en futuras iteraciones.</p>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
