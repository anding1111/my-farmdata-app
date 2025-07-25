import { useState, useRef, useEffect } from "react";
import { Search, Package, Barcode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchProducts } from "@/hooks/useInventory";
import { type Product } from "@/api/inventory";

interface ProductSearchInputProps {
  value?: number;
  onSelect: (product: Product) => void;
  placeholder?: string;
  className?: string;
}

const ProductSearchInput = ({ 
  value, 
  onSelect, 
  placeholder = "Buscar producto por nombre o código de barras...",
  className 
}: ProductSearchInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    isSearching 
  } = useSearchProducts();

  // Selected product state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Handle input changes
  const handleInputChange = (query: string) => {
    setInputValue(query);
    setSelectedProduct(null);
    
    // Only search if 2+ characters or looks like barcode
    if (query.length >= 2 || /^\d+$/.test(query)) {
      setSearchQuery(query);
      setIsOpen(true);
    } else {
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setInputValue(`${product.code} - ${product.name}`);
    setIsOpen(false);
    setSearchQuery("");
    onSelect(product);
  };

  // Handle focus
  const handleInputFocus = () => {
    if (searchResults.length > 0 || isSearching) {
      setIsOpen(true);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear search
  const handleClear = () => {
    setInputValue("");
    setSelectedProduct(null);
    setSearchQuery("");
    setIsOpen(false);
    onSelect({ id: 0 } as Product); // Reset selection
  };

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">{part}</span>
      ) : part
    );
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
          >
            ×
          </Button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {isSearching ? (
            <div className="p-3 text-center text-muted-foreground">
              <Search className="h-4 w-4 animate-spin mx-auto mb-2" />
              Buscando productos...
            </div>
          ) : searchResults.length === 0 && searchQuery ? (
            <div className="p-3 text-center text-muted-foreground">
              <Package className="h-6 w-6 mx-auto mb-2" />
              No se encontraron productos
              <p className="text-xs mt-1">
                Intenta buscar por nombre o código de barras
              </p>
            </div>
          ) : (
            searchResults.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleProductSelect(product)}
                className="w-full p-3 text-left hover:bg-muted border-b border-border last:border-0 focus:bg-muted focus:outline-none"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="font-medium text-sm">
                        {highlightMatch(product.name, searchQuery)}
                      </span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-muted px-2 py-0.5 rounded">
                          {highlightMatch(product.code, searchQuery)}
                        </span>
                        {product.barcode && (
                          <span className="flex items-center gap-1">
                            <Barcode className="h-3 w-3" />
                            {highlightMatch(product.barcode, searchQuery)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Stock: {product.current_stock}</span>
                        <span className="font-medium">${product.sale_price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Search hints */}
      {!inputValue && (
        <p className="text-xs text-muted-foreground mt-1">
          Escribe al menos 2 caracteres para buscar por nombre o ingresa un código de barras
        </p>
      )}
    </div>
  );
};

export default ProductSearchInput;