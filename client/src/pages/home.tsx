import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/product-card";
import { RequestProductForm } from "@/components/request-product-form";
import { ShoppingCart, Package, Star, TrendingUp } from "lucide-react";
import type { Product, Order } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: orders } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const { data: cartItems } = useQuery({
    queryKey: ["/api/cart"],
  });

  const featuredProducts = products?.slice(0, 8) || [];
  const cartItemCount = cartItems?.length || 0;
  const orderCount = orders?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Welcome Section */}
        <section className="py-12 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4" data-testid="text-welcome-title">
                Welcome back, {user?.firstName || 'there'}!
              </h1>
              <p className="text-xl text-muted-foreground">
                Discover amazing products and manage your orders with ease.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card data-testid="card-cart-items">
                <CardContent className="p-6 text-center">
                  <ShoppingCart className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold" data-testid="text-cart-count">{cartItemCount}</div>
                  <div className="text-sm text-muted-foreground">Items in Cart</div>
                </CardContent>
              </Card>

              <Card data-testid="card-orders">
                <CardContent className="p-6 text-center">
                  <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold" data-testid="text-order-count">{orderCount}</div>
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                </CardContent>
              </Card>

              <Card data-testid="card-featured">
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold" data-testid="text-featured-count">{featuredProducts.length}</div>
                  <div className="text-sm text-muted-foreground">Featured Products</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2" data-testid="text-featured-products-title">Featured Products</h2>
                <p className="text-muted-foreground">Handpicked products just for you</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => window.location.href = "/products"}
                data-testid="button-view-all-products"
              >
                View All
              </Button>
            </div>

            {productsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : featuredProducts.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2" data-testid="text-no-products">No Products Available</h3>
                <p className="text-muted-foreground">Check back later for new products!</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Request Product Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 mb-4">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Custom Sourcing
                </Badge>
                <h2 className="text-3xl font-bold mb-4" data-testid="text-request-section-title">
                  Can't Find What You Need?
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Request any product and our experts will source it for you at the best price.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Expert sourcing from verified suppliers
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Quality guaranteed before shipping
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Fast response within 24 hours
                  </li>
                </ul>
              </div>

              <RequestProductForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
