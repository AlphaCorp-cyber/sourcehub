import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartItem } from "@/components/cart-item";
import { ShoppingCart, ArrowLeft, Package } from "lucide-react";
import type { CartItem as CartItemType, Product } from "@shared/schema";

type CartItemWithProduct = CartItemType & { product: Product };

export default function Cart() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartItems, isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      // Clear cart by removing each item
      if (cartItems) {
        await Promise.all(
          cartItems.map(item => 
            apiRequest("DELETE", `/api/cart/${item.id}`)
          )
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart.",
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
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const calculateTotal = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.product.price) * item.quantity);
    }, 0);
  };

  const calculateSubtotal = () => calculateTotal();
  const shipping = 0; // Free shipping
  const tax = calculateSubtotal() * 0.08; // 8% tax
  const finalTotal = calculateSubtotal() + shipping + tax;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex space-x-4">
                        <div className="w-20 h-20 bg-muted rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                          <div className="h-4 bg-muted rounded w-1/4"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div>
                <Card className="animate-pulse">
                  <CardContent className="p-6 space-y-4">
                    <div className="h-6 bg-muted rounded w-1/2"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded"></div>
                    </div>
                    <div className="h-10 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Header */}
        <div className="bg-muted/50 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2" data-testid="text-cart-title">Shopping Cart</h1>
                <p className="text-muted-foreground">
                  {cartItems?.length || 0} {cartItems?.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => window.location.href = "/products"}
                data-testid="button-continue-shopping"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>

        {/* Cart Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {!cartItems || cartItems.length === 0 ? (
              <Card className="p-12 text-center">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2" data-testid="text-empty-cart">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <Button 
                  onClick={() => window.location.href = "/products"}
                  data-testid="button-shop-now"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Start Shopping
                </Button>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Items</h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => clearCartMutation.mutate()}
                      disabled={clearCartMutation.isPending}
                      data-testid="button-clear-cart"
                    >
                      Clear Cart
                    </Button>
                  </div>

                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>

                {/* Order Summary */}
                <div>
                  <Card className="sticky top-20">
                    <CardHeader>
                      <CardTitle data-testid="text-order-summary-title">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span data-testid="text-subtotal">${calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span className="text-green-600" data-testid="text-shipping">Free</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span data-testid="text-tax">${tax.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total</span>
                          <span data-testid="text-total">${finalTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      <Button 
                        size="lg" 
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => window.location.href = "/checkout"}
                        data-testid="button-checkout"
                      >
                        Proceed to Checkout
                      </Button>

                      <div className="text-xs text-muted-foreground text-center">
                        Secure checkout with 256-bit SSL encryption
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
