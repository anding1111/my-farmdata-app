/**
 * Configuración de localización para Colombia
 */

// Configuración regional
export const LOCALE_CONFIG = {
  // Idioma
  language: 'es' as const,
  // País
  country: 'CO' as const,
  // Código de localización completo
  locale: 'es-CO' as const,
  // Zona horaria
  timeZone: 'America/Bogota' as const,
  // Moneda
  currency: 'COP' as const,
  // Formato de fecha por defecto
  dateFormat: 'dd/MM/yyyy' as const,
  // Formato de fecha y hora por defecto
  dateTimeFormat: 'dd/MM/yyyy HH:mm' as const,
};

// Función para formatear moneda colombiana (COP)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat(LOCALE_CONFIG.locale, {
    style: 'currency',
    currency: LOCALE_CONFIG.currency,
    minimumFractionDigits: 0
  }).format(value);
};

// Función para formatear números
export const formatNumber = (value: number, decimals: number = 0): string => {
  return new Intl.NumberFormat(LOCALE_CONFIG.locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

// Función para obtener la fecha actual en la zona horaria de Colombia
export const getCurrentDate = (): Date => {
  return new Date();
};

// Función para formatear fecha
export const formatDate = (date: Date | string, format: string = LOCALE_CONFIG.dateFormat): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Mapeo de formatos simples
  const formatMap: Record<string, Intl.DateTimeFormatOptions> = {
    'dd/MM/yyyy': { day: '2-digit', month: '2-digit', year: 'numeric' },
    'dd/MM/yy': { day: '2-digit', month: '2-digit', year: '2-digit' },
    'dd/MM/yyyy HH:mm': { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }
  };

  const formatOptions = formatMap[format] || formatMap[LOCALE_CONFIG.dateFormat];
  
  return new Intl.DateTimeFormat(LOCALE_CONFIG.locale, {
    ...formatOptions,
    timeZone: LOCALE_CONFIG.timeZone
  }).format(dateObj);
};

// Configuración para date-fns
export { es as dateLocale } from 'date-fns/locale';

// Opciones de zona horaria para selects
export const TIMEZONE_OPTIONS = [
  { value: 'America/Bogota', label: 'Colombia (Bogotá)' },
  { value: 'America/Caracas', label: 'Venezuela (Caracas)' },
  { value: 'America/Lima', label: 'Perú (Lima)' },
  { value: 'America/Quito', label: 'Ecuador (Quito)' },
  { value: 'America/La_Paz', label: 'Bolivia (La Paz)' },
];

// Opciones de moneda para selects
export const CURRENCY_OPTIONS = [
  { value: 'COP', label: 'Peso Colombiano (COP)', symbol: '$' },
  { value: 'USD', label: 'Dólar Estadounidense (USD)', symbol: '$' },
  { value: 'EUR', label: 'Euro (EUR)', symbol: '€' },
  { value: 'PEN', label: 'Sol Peruano (PEN)', symbol: 'S/' },
  { value: 'VES', label: 'Bolívar Venezolano (VES)', symbol: 'Bs' },
];

// Función para inicializar la configuración de localización
export const initializeLocale = (): void => {
  // Configurar el idioma del documento
  if (typeof document !== 'undefined') {
    document.documentElement.lang = LOCALE_CONFIG.language;
  }
  
  // Verificar soporte para la zona horaria
  try {
    Intl.DateTimeFormat(LOCALE_CONFIG.locale, { 
      timeZone: LOCALE_CONFIG.timeZone 
    });
  } catch (error) {
    console.warn('Zona horaria no soportada:', LOCALE_CONFIG.timeZone);
  }
};