import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Package, Eye, ArrowLeft, Calendar, CreditCard } from "lucide-react";
import { format } from "date-fns";
import type { Order } from "@shared/schema";

export default function OrderHistory() {
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '⏳';
      case 'paid':
        return '💳';
      case 'processing':
        return '⚙️';
      case 'shipped':
        return '🚚';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📦';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-32"></div>
                        <div className="h-4 bg-muted rounded w-24"></div>
                      </div>
                      <div className="h-6 bg-muted rounded w-20"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-48"></div>
                      <div className="h-4 bg-muted rounded w-32"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                <h1 className="text-3xl font-bold mb-2" data-testid="text-orders-title">Order History</h1>
                <p className="text-muted-foreground">
                  Track and manage your orders
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

        {/* Orders */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {!orders || orders.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2" data-testid="text-no-orders">No orders yet</h2>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <Button 
                  onClick={() => window.location.href = "/products"}
                  data-testid="button-start-shopping"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Start Shopping
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold" data-testid="text-orders-count">
                    {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                  </h2>
                </div>

                {orders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow" data-testid={`card-order-${order.id}`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg" data-testid={`text-order-id-${order.id}`}>
                            Order #{order.id.slice(-8).toUpperCase()}
                          </CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span data-testid={`text-order-date-${order.id}`}>
                                {format(new Date(order.createdAt || ''), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CreditCard className="w-4 h-4" />
                              <span data-testid={`text-order-total-${order.id}`}>
                                ${parseFloat(order.total).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Badge 
                            className={getStatusColor(order.status || 'pending')}
                            data-testid={`badge-order-status-${order.id}`}
                          >
                            <span className="mr-1">{getStatusIcon(order.status || 'pending')}</span>
                            {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                          </Badge>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = `/orders/${order.id}`}
                            data-testid={`button-view-order-${order.id}`}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <Separator className="mb-4" />
                      
                      {/* Order Summary */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Status</span>
                          <span className="capitalize">{order.status || 'pending'}</span>
                        </div>
                        
                        {order.shippingAddress && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shipping to</span>
                            <span className="text-right max-w-48 truncate">
                              {typeof order.shippingAddress === 'object' && (order.shippingAddress as any).name
                                ? `${(order.shippingAddress as any).name}, ${(order.shippingAddress as any).city}`
                                : 'Address on file'}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Order Total</span>
                          <span className="font-semibold">${parseFloat(order.total).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex space-x-2 mt-4">
                        {order.status === 'delivered' && (
                          <Button variant="outline" size="sm" data-testid={`button-reorder-${order.id}`}>
                            Order Again
                          </Button>
                        )}
                        {(order.status === 'shipped' || order.status === 'processing') && (
                          <Button variant="outline" size="sm" data-testid={`button-track-${order.id}`}>
                            Track Package
                          </Button>
                        )}
                        {order.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            data-testid={`button-cancel-${order.id}`}
                          >
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
