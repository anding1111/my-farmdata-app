import { Product, ProductList } from "@/types/product";

// Import generated images
import vitaminD3 from "@/assets/vitamin-d3.jpg";
import jointTablets from "@/assets/joint-tablets.jpg";
import liquidDrops from "@/assets/liquid-drops.jpg";
import cardioCapsules from "@/assets/cardio-capsules.jpg";
import kidsVitamins from "@/assets/kids-vitamins.jpg";
import digestiveHerbs from "@/assets/digestive-herbs.jpg";
import calciumTablets from "@/assets/calcium-tablets.jpg";
import omega3Capsules from "@/assets/omega3-capsules.jpg";

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Vitamina D3 Ultra",
    description: "Suplemento de vitamina D3 de alta potencia para fortalecer huesos y sistema inmune",
    price: 34000,
    category: "Vitaminas",
    manufacturer: "NutriPharm",
    activeIngredient: "Colecalciferol 4000 UI",
    dosage: "1 cápsula diaria",
    image: vitaminD3,
    inStock: true,
    prescription: false,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Jointum Gotas",
    description: "Suplemento líquido para la salud articular con glucosamina y condroitina",
    price: 28000,
    category: "Articulaciones",
    manufacturer: "ArthroLab",
    activeIngredient: "Glucosamina + Condroitina",
    dosage: "20 gotas 2 veces al día",
    image: liquidDrops,
    inStock: true,
    prescription: false,
    createdAt: "2024-01-20T14:15:00Z",
  },
  {
    id: 3,
    name: "Jointum Tabletas",
    description: "Tabletas para el cuidado articular con fórmula avanzada",
    price: 32000,
    category: "Articulaciones",
    manufacturer: "ArthroLab",
    activeIngredient: "Glucosamina + MSM",
    dosage: "2 tabletas al día con las comidas",
    image: jointTablets,
    inStock: true,
    prescription: false,
    createdAt: "2024-01-22T09:45:00Z",
  },
  {
    id: 4,
    name: "Cardio Protect",
    description: "Cápsulas para la salud cardiovascular con Omega-3 y Coenzima Q10",
    price: 45000,
    category: "Cardiovascular",
    manufacturer: "HeartCare",
    activeIngredient: "Omega-3 + CoQ10",
    dosage: "1 cápsula 2 veces al día",
    image: cardioCapsules,
    inStock: true,
    prescription: false,
    createdAt: "2024-02-01T11:20:00Z",
  },
  {
    id: 5,
    name: "Vitaminas Kids",
    description: "Gomitas multivitamínicas para niños con sabores naturales",
    price: 25000,
    category: "Pediátrico",
    manufacturer: "KidsHealth",
    activeIngredient: "Multivitamínicos + Minerales",
    dosage: "2 gomitas al día",
    image: kidsVitamins,
    inStock: true,
    prescription: false,
    createdAt: "2024-02-05T16:30:00Z",
  },
  {
    id: 6,
    name: "Digestivo Natural",
    description: "Suplemento herbal para la salud digestiva con probióticos",
    price: 38000,
    category: "Digestivo",
    manufacturer: "NaturalWell",
    activeIngredient: "Probióticos + Enzimas digestivas",
    dosage: "1 cápsula antes de cada comida",
    image: digestiveHerbs,
    inStock: true,
    prescription: false,
    createdAt: "2024-02-10T13:45:00Z",
  },
  {
    id: 7,
    name: "Calcio Plus",
    description: "Suplemento de calcio con magnesio y vitamina K2",
    price: 29000,
    category: "Minerales",
    manufacturer: "BoneStrong",
    activeIngredient: "Calcio + Magnesio + Vitamina K2",
    dosage: "2 tabletas al día con las comidas",
    image: calciumTablets,
    inStock: true,
    prescription: false,
    createdAt: "2024-02-15T10:15:00Z",
  },
  {
    id: 8,
    name: "Omega-3 Premium",
    description: "Cápsulas de aceite de pescado de alta pureza",
    price: 42000,
    category: "Ácidos grasos",
    manufacturer: "MarinePure",
    activeIngredient: "EPA + DHA concentrado",
    dosage: "2 cápsulas al día con las comidas",
    image: omega3Capsules,
    inStock: true,
    prescription: false,
    createdAt: "2024-02-20T15:30:00Z",
  },
];

export const mockProductLists: ProductList[] = [
  {
    id: 1,
    name: "Mis vitaminas",
    description: "Suplementos diarios para mantener mi salud",
    total: 123000,
    products: [
      {
        productId: 1,
        quantity: 1,
        image: vitaminD3,
        name: "Vitamina D3 Ultra",
        price: 34000,
      },
      {
        productId: 7,
        quantity: 1,
        image: calciumTablets,
        name: "Calcio Plus",
        price: 29000,
      },
      {
        productId: 8,
        quantity: 1,
        image: omega3Capsules,
        name: "Omega-3 Premium",
        price: 42000,
      },
      {
        productId: 5,
        quantity: 1,
        image: kidsVitamins,
        name: "Vitaminas Kids",
        price: 25000,
      },
    ],
    moreCount: 2,
    color: "blue",
    icon: "heart",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Para padres",
    description: "Medicamentos esenciales para adultos mayores",
    total: 77000,
    products: [
      {
        productId: 4,
        quantity: 1,
        image: cardioCapsules,
        name: "Cardio Protect",
        price: 45000,
      },
      {
        productId: 3,
        quantity: 1,
        image: jointTablets,
        name: "Jointum Tabletas",
        price: 32000,
      },
    ],
    moreCount: 0,
    color: "green",
    icon: "stethoscope",
    createdAt: "2024-01-20T14:15:00Z",
  },
  {
    id: 3,
    name: "Vacaciones",
    description: "Kit básico para emergencias en viajes",
    total: 67000,
    products: [
      {
        productId: 6,
        quantity: 1,
        image: digestiveHerbs,
        name: "Digestivo Natural",
        price: 38000,
      },
      {
        productId: 2,
        quantity: 1,
        image: liquidDrops,
        name: "Jointum Gotas",
        price: 28000,
      },
    ],
    moreCount: 0,
    color: "orange",
    icon: "home",
    createdAt: "2024-02-01T11:20:00Z",
  },
  {
    id: 4,
    name: "Medicinas para niños",
    description: "Suplementos seguros y efectivos para los más pequeños",
    total: 87000,
    products: [
      {
        productId: 5,
        quantity: 2,
        image: kidsVitamins,
        name: "Vitaminas Kids",
        price: 25000,
      },
      {
        productId: 7,
        quantity: 1,
        image: calciumTablets,
        name: "Calcio Plus",
        price: 29000,
      },
      {
        productId: 6,
        quantity: 1,
        image: digestiveHerbs,
        name: "Digestivo Natural",
        price: 38000,
      },
    ],
    moreCount: 5,
    color: "purple",
    icon: "baby",
    createdAt: "2024-02-05T16:30:00Z",
  },
];

// Función para formatear moneda colombiana (COP)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value);
};

// Función para calcular el total de una lista
export const calculateListTotal = (products: ProductList['products']): number => {
  return products.reduce((total, item) => total + (item.price * item.quantity), 0);
};