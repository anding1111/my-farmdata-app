# FarmData App - Sistema de Gestión Farmacéutica

## 📋 Descripción del Proyecto

FarmData es un sistema completo de gestión farmacéutica que combina un frontend en React (este repositorio) con un backend en Laravel. El sistema está configurado para Colombia con localización en español, zona horaria America/Bogotá y moneda en pesos colombianos (COP).

## 🏗️ Estructura del Proyecto

```
my-farmdata-app/
├── src/                    ← React frontend (este repositorio)
│   ├── api/               ← Helpers para conectar con backend
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   └── ...
└── routes/                ← Laravel routes (api.php & web.php)
```

## 🚀 Instalación y Configuración en macOS

### Prerrequisitos

1. **Node.js y npm** (recomendado usar nvm):
```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reiniciar terminal o ejecutar:
source ~/.bashrc

# Instalar Node.js LTS
nvm install --lts
nvm use --lts
```

2. **Git**:
```bash
# Verificar si git está instalado
git --version

# Si no está instalado, instalar con Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install git
```

### Instalación del Frontend (React)

1. **Clonar el repositorio**:
```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Iniciar el servidor de desarrollo**:
```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:8080`

### Scripts Disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la build de producción
npm run lint         # Ejecuta el linter
```

## 🔗 Conexión con Backend Laravel

### Configuración de API

Los archivos de conexión con el backend están en `src/api/`:

- `auth.ts` - Autenticación y gestión de usuarios
- `clients.ts` - Gestión de clientes
- `inventory.ts` - Gestión de inventario
- `reports.ts` - Generación de reportes
- `settings.ts` - Configuraciones del sistema
- `suppliers.ts` - Gestión de proveedores

### Variables de Entorno

**⚠️ IMPORTANTE**: Este proyecto NO usa variables de entorno tipo `VITE_*` ya que Lovable no las soporta.

### Configuración de URLs del Backend

Actualiza las URLs del backend en los archivos de `src/api/` según tu configuración:

```typescript
// Ejemplo en src/api/auth.ts
const API_BASE_URL = 'http://localhost:8000/api'; // Laravel backend local
// o
const API_BASE_URL = 'https://tu-dominio.com/api'; // Backend en producción
```

### Configuración CORS en Laravel

En tu backend Laravel, asegúrate de configurar CORS correctamente:

```php
// config/cors.php
'allowed_origins' => [
    'http://localhost:8080',  // Frontend local
    'https://tu-frontend.lovable.app', // Frontend en Lovable
],
```

### Headers Requeridos

El frontend está configurado para enviar estos headers:

```typescript
{
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${token}`, // Cuando hay autenticación
}
```

### Estructura de Respuestas API

El frontend espera que el backend Laravel responda con esta estructura:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa",
  "errors": null
}
```

## 🌍 Localización

El proyecto está configurado para:
- **Idioma**: Español (es)
- **País**: Colombia (CO)
- **Zona horaria**: America/Bogotá
- **Moneda**: Peso Colombiano (COP)
- **Formatos de fecha**: DD/MM/YYYY

## 🔧 Configuración de Desarrollo

### Modo Desarrollo

En desarrollo, la autenticación está deshabilitada para facilitar las pruebas. Esto se controla automáticamente detectando el entorno:

```typescript
const isDevelopmentMode = () => {
  return (
    window.location.hostname.includes('lovable.app') ||
    window.location.hostname === 'localhost' ||
    import.meta.env.DEV
  );
};
```

### Base de Datos Mock

Para desarrollo sin backend, el sistema incluye datos de prueba en `src/data/mockData.ts` con:
- Productos farmacéuticos colombianos
- Clientes de ejemplo
- Proveedores locales
- Datos en formato de Colombia

## 📝 Notas Importantes

1. **Autenticación**: El sistema usa JWT tokens para autenticación con Laravel Sanctum
2. **Fechas**: Todas las fechas se manejan en zona horaria America/Bogotá
3. **Moneda**: Los precios se formatean automáticamente en COP
4. **Responsive**: El diseño es completamente responsive para móviles y desktop
5. **TypeScript**: Todo el código está tipado con TypeScript
6. **Componentes**: Usa shadcn/ui con Tailwind CSS para el diseño

## 🚨 Solución de Problemas Comunes

### Error de CORS
```bash
# Verificar que Laravel tenga CORS configurado correctamente
# Y que las URLs estén en allowed_origins
```

### Error de conexión a API
```bash
# Verificar que el backend Laravel esté ejecutándose
php artisan serve --host=0.0.0.0 --port=8000

# Verificar que las URLs en src/api/ sean correctas
```

### Problemas con npm install
```bash
# Limpiar caché de npm
npm cache clean --force

# Borrar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📞 Soporte

Para problemas específicos con el backend Laravel, revisa la documentación del proyecto backend.
Para problemas con el frontend o deployment, consulta la documentación de Lovable.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/1948dbe8-345e-48ab-8b80-022dd1dc73c7) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
