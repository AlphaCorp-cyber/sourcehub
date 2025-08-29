import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/layout/navbar";
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Clock,
  CheckCircle2
} from "lucide-react";
import type { Order, Product, ProductRequest } from "@shared/schema";

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      toast({
        title: "Unauthorized",
        description: "You don't have admin access.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return;
    }
  }, [user, authLoading, toast]);

  const { data: orders } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
    enabled: !!user?.isAdmin,
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: !!user?.isAdmin,
  });

  const { data: requests } = useQuery<ProductRequest[]>({
    queryKey: ["/api/admin/product-requests"],
    enabled: !!user?.isAdmin,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        </main>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  // Calculate metrics
  const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;
  const totalOrders = orders?.length || 0;
  const pendingRequests = requests?.filter(req => req.status === 'pending').length || 0;
  const lowStockProducts = products?.filter(product => (product.stock || 0) < 10).length || 0;

  const recentOrders = orders?.slice(0, 5) || [];
  const recentRequests = requests?.slice(0, 5) || [];

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
      case 'quoted':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2" data-testid="text-admin-dashboard-title">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Manage your eCommerce platform
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/admin/products"}
                  data-testid="button-manage-products"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Products
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/admin/orders"}
                  data-testid="button-manage-orders"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Orders
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/admin/requests"}
                  data-testid="button-manage-requests"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Requests
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold" data-testid="text-total-revenue">
                        ${totalRevenue.toFixed(2)}
                      </p>
                      <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold" data-testid="text-total-orders">
                        {totalOrders}
                      </p>
                      <p className="text-xs text-green-600 mt-1">+8.2% from last month</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                      <p className="text-2xl font-bold" data-testid="text-pending-requests">
                        {pendingRequests}
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        {pendingRequests > 0 ? 'Needs attention' : 'All caught up'}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                      <p className="text-2xl font-bold" data-testid="text-low-stock">
                        {lowStockProducts}
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        {lowStockProducts > 0 ? 'Needs restocking' : 'Stock levels good'}
                      </p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span data-testid="text-recent-orders-title">Recent Orders</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = "/admin/orders"}
                      data-testid="button-view-all-orders"
                    >
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentOrders.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4" data-testid="text-no-recent-orders">
                      No recent orders
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div 
                          key={order.id} 
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                          data-testid={`card-recent-order-${order.id}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-xs font-medium">
                              #{order.id.slice(-4)}
                            </div>
                            <div>
                              <div className="font-medium text-sm">Order #{order.id.slice(-8)}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(order.createdAt || '').toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-sm">${parseFloat(order.total).toFixed(2)}</div>
                            <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span data-testid="text-recent-requests-title">Recent Product Requests</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = "/admin/requests"}
                      data-testid="button-view-all-requests"
                    >
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentRequests.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4" data-testid="text-no-recent-requests">
                      No recent requests
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {recentRequests.map((request) => (
                        <div 
                          key={request.id} 
                          className="p-3 bg-muted/30 rounded-lg"
                          data-testid={`card-recent-request-${request.id}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-medium text-sm line-clamp-1">
                              {request.description.slice(0, 50)}...
                            </div>
                            <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                              {request.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Budget: {request.budgetRange}</span>
                            <span>{new Date(request.createdAt || '').toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-8 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6" data-testid="text-quick-actions-title">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = "/admin/products"}>
                <CardContent className="p-6 text-center">
                  <Package className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Add New Product</h3>
                  <p className="text-sm text-muted-foreground">
                    Add products to your catalog with images and details
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = "/admin/orders"}>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">View Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Track sales performance and order trends
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = "/admin/requests"}>
                <CardContent className="p-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Handle Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    Respond to customer product requests with quotes
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
