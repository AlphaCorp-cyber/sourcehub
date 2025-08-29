import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { ShoppingCart, Star } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartMutation.mutate();
  };

  const handleProductClick = () => {
    window.location.href = `/products/${product.id}`;
  };

  return (
    <Card 
      className="group overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
      onClick={handleProductClick}
      data-testid={`card-product-${product.id}`}
    >
      <div className="relative">
        <img 
          src={product.imageUrl || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"} 
          alt={product.name} 
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          data-testid={`img-product-${product.id}`}
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="bg-accent/10 text-accent">
            {product.category || "General"}
          </Badge>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-current" />
            ))}
          </div>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2" data-testid={`text-product-description-${product.id}`}>
          {product.description || "No description available"}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
            ${parseFloat(product.price).toFixed(2)}
          </span>
          
          <Button 
            size="sm" 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending || product.stock === 0}
            data-testid={`button-add-to-cart-${product.id}`}
          >
            {addToCartMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    category: string;
    stock?: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        // Could add a toast notification here
        console.log("Added to cart successfully");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const isOutOfStock = product.stock === 0;

  return (
    <Card className="group overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="bg-accent/10 text-accent">
            {product.category}
          </Badge>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-current" />
            ))}
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-2 cursor-pointer hover:text-primary transition-colors"
            onClick={() => window.location.href = `/products/${product.id}`}>
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${product.price}
          </span>
          <Button 
            size="sm" 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
