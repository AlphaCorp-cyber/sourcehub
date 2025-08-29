import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, Package } from "lucide-react";
import type { CartItem as CartItemType, Product } from "@shared/schema";

interface CartItemProps {
  item: CartItemType & { product: Product };
}

export function CartItem({ item }: CartItemProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateQuantityMutation = useMutation({
    mutationFn: async (newQuantity: number) => {
      const response = await apiRequest("PUT", `/api/cart/${item.id}`, {
        quantity: newQuantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      setIsUpdating(false);
    },
    onError: (error) => {
      setIsUpdating(false);
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Error",
        description: "Failed to update item quantity. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/cart/${item.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item Removed",
        description: `${item.product.name} has been removed from your cart.`,
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
          window.location.href = "/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > (item.product.stock || 1)) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${item.product.stock} items available in stock.`,
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    updateQuantityMutation.mutate(newQuantity);
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (isNaN(newQuantity) || newQuantity < 1) return;
    handleQuantityChange(newQuantity);
  };

  const itemTotal = parseFloat(item.product.price) * item.quantity;
  const isOutOfStock = (item.product.stock || 0) === 0;

  return (
    <Card className="overflow-hidden" data-testid={`cart-item-${item.id}`}>
      <CardContent className="p-6">
        <div className="flex space-x-4">
          {/* Product Image */}
          <div className="relative flex-shrink-0">
            <img 
              src={item.product.imageUrl || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
              alt={item.product.name} 
              className="w-20 h-20 object-cover rounded-lg"
              data-testid={`cart-item-image-${item.id}`}
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 
                  className="font-semibold text-lg line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => window.location.href = `/products/${item.product.id}`}
                  data-testid={`cart-item-name-${item.id}`}
                >
                  {item.product.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {item.product.description || "No description available"}
                </p>
                {item.product.category && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {item.product.category}
                  </Badge>
                )}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => removeItemMutation.mutate()}
                disabled={removeItemMutation.isPending}
                data-testid={`button-remove-item-${item.id}`}
              >
                {removeItemMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>

            <Separator className="my-3" />

            {/* Price and Quantity Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="text-lg font-bold text-primary" data-testid={`cart-item-price-${item.id}`}>
                    ${parseFloat(item.product.price).toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    per item
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={item.quantity <= 1 || isUpdating || isOutOfStock}
                    data-testid={`button-decrease-quantity-${item.id}`}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  
                  <Input 
                    type="number"
                    value={item.quantity}
                    onChange={handleQuantityInputChange}
                    className="w-16 h-8 text-center text-sm"
                    min="1"
                    max={item.product.stock || undefined}
                    disabled={isUpdating || isOutOfStock}
                    data-testid={`input-quantity-${item.id}`}
                  />
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={item.quantity >= (item.product.stock || 1) || isUpdating || isOutOfStock}
                    data-testid={`button-increase-quantity-${item.id}`}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <div className="text-xl font-bold" data-testid={`cart-item-total-${item.id}`}>
                  ${itemTotal.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.quantity} {item.quantity === 1 ? 'item' : 'items'}
                </div>
              </div>
            </div>

            {/* Stock Warning */}
            {!isOutOfStock && (item.product.stock || 0) < 10 && (
              <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                  <Package className="w-4 h-4" />
                  <span className="text-sm">
                    Only {item.product.stock} left in stock
                  </span>
                </div>
              </div>
            )}

            {/* Out of Stock Warning */}
            {isOutOfStock && (
              <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/30 rounded-lg">
                <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
                  <Package className="w-4 h-4" />
                  <span className="text-sm">
                    This item is currently out of stock
                  </span>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isUpdating && (
              <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">
                    Updating quantity...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
