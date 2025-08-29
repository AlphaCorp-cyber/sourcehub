import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useState } from "react";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Star, 
  Package, 
  Truck, 
  Shield, 
  Heart,
  Share2,
  Plus,
  Minus
} from "lucide-react";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["/api/products", id],
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cart", {
        productId: id,
        quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to Cart",
        description: `${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart.`,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="animate-pulse">
                <div className="w-full h-96 bg-muted rounded-2xl"></div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-muted rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                <div className="h-6 bg-muted rounded w-1/4 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-12">
            <Card className="p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2" data-testid="text-product-not-found">Product Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The product you're looking for doesn't exist or has been removed.
              </p>
              <Button 
                onClick={() => window.location.href = "/products"}
                data-testid="button-browse-products"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Browse Products
              </Button>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(product.stock || 1, quantity + delta));
    setQuantity(newQuantity);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Breadcrumb */}
        <div className="bg-muted/50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-2 text-sm">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = "/products"}
                data-testid="button-back-to-products"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Products
              </Button>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Product Detail */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={product.imageUrl || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"} 
                    alt={product.name} 
                    className="w-full h-96 object-cover rounded-2xl shadow-lg"
                    data-testid="img-product-main"
                  />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                      <Badge variant="destructive" className="text-lg px-4 py-2">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="bg-accent/10 text-accent">
                      {product.category || "General"}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" data-testid="button-favorite">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" data-testid="button-share">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-2" data-testid="text-product-title">
                    {product.name}
                  </h1>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">(4.8 out of 5)</span>
                  </div>
                  
                  <div className="text-3xl font-bold text-primary mb-4" data-testid="text-product-price">
                    ${parseFloat(product.price).toFixed(2)}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed" data-testid="text-product-description">
                    {product.description || "No description available for this product."}
                  </p>
                </div>

                <Separator />

                {/* Quantity and Add to Cart */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <div className="flex items-center space-x-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        data-testid="button-decrease-quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input 
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock || 1, parseInt(e.target.value) || 1)))}
                        className="w-20 text-center"
                        min="1"
                        max={product.stock || undefined}
                        data-testid="input-quantity"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= (product.stock || 1)}
                        data-testid="button-increase-quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {product.stock} available
                      </span>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => addToCartMutation.mutate()}
                    disabled={addToCartMutation.isPending || isOutOfStock}
                    data-testid="button-add-to-cart"
                  >
                    {addToCartMutation.isPending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <ShoppingCart className="w-5 h-5 mr-2" />
                    )}
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>

                <Separator />

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Free worldwide shipping</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">Quality guaranteed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-purple-600" />
                    <span className="text-sm">Secure packaging</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
