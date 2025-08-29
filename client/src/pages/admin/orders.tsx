import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Navbar } from "@/components/layout/navbar";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Search, 
  Eye, 
  Package,
  Calendar,
  CreditCard,
  MapPin,
  Truck
} from "lucide-react";
import type { Order, OrderItem, Product } from "@shared/schema";

type OrderWithItems = Order & { 
  orderItems: (OrderItem & { product: Product })[] 
};

export default function AdminOrders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
    enabled: !!user?.isAdmin,
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const response = await apiRequest("PUT", `/api/admin/orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({
        title: "Status Updated",
        description: "Order status has been successfully updated.",
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
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { data: orderDetails } = useQuery<OrderWithItems>({
    queryKey: ["/api/orders", selectedOrder?.id],
    enabled: !!selectedOrder?.id,
  });

  // Filter orders
  const filteredOrders = orders?.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

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

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatusMutation.mutate({ orderId, status: newStatus });
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-12">
            <Card className="p-12 text-center">
              <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
              <p className="text-muted-foreground">You don't have admin privileges.</p>
            </Card>
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
                <div className="flex items-center space-x-4 mb-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.location.href = "/admin"}
                    data-testid="button-back-to-dashboard"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </Button>
                </div>
                <h1 className="text-3xl font-bold mb-2" data-testid="text-orders-management-title">
                  Order Management
                </h1>
                <p className="text-muted-foreground">
                  View and manage customer orders
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <section className="py-6 bg-card border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-orders"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48" data-testid="select-status-filter">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Orders */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="space-y-4">
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
            ) : filteredOrders.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2" data-testid="text-no-orders">
                  {searchQuery || statusFilter !== "all" ? "No orders found" : "No orders yet"}
                </h2>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all" 
                    ? "Try adjusting your search criteria." 
                    : "Orders will appear here when customers make purchases."}
                </p>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold" data-testid="text-orders-count">
                    {filteredOrders.length} Orders
                  </h2>
                </div>

                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="hover:shadow-md transition-shadow" data-testid={`card-order-${order.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-4">
                              <h3 className="text-lg font-semibold" data-testid={`text-order-id-${order.id}`}>
                                Order #{order.id.slice(-8).toUpperCase()}
                              </h3>
                              <Badge className={getStatusColor(order.status || 'pending')} data-testid={`badge-order-status-${order.id}`}>
                                {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{format(new Date(order.createdAt || ''), 'MMM dd, yyyy HH:mm')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <CreditCard className="w-4 h-4" />
                                <span>${parseFloat(order.total).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Select 
                              value={order.status || 'pending'}
                              onValueChange={(newStatus) => handleStatusUpdate(order.id, newStatus)}
                            >
                              <SelectTrigger className="w-32" data-testid={`select-order-status-${order.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedOrder(order as OrderWithItems)}
                                  data-testid={`button-view-order-${order.id}`}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Order Details</DialogTitle>
                                </DialogHeader>
                                
                                {orderDetails && (
                                  <div className="space-y-6">
                                    {/* Order Info */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-semibold mb-2">Order Information</h4>
                                        <div className="space-y-1 text-sm">
                                          <div>ID: #{orderDetails.id.slice(-8).toUpperCase()}</div>
                                          <div>Date: {format(new Date(orderDetails.createdAt || ''), 'MMM dd, yyyy HH:mm')}</div>
                                          <div>Status: <Badge className={getStatusColor(orderDetails.status || 'pending')}>{orderDetails.status || 'pending'}</Badge></div>
                                          <div>Total: ${parseFloat(orderDetails.total).toFixed(2)}</div>
                                        </div>
                                      </div>
                                      
                                      {orderDetails.shippingAddress && (
                                        <div>
                                          <h4 className="font-semibold mb-2 flex items-center">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            Shipping Address
                                          </h4>
                                          <div className="text-sm text-muted-foreground">
                                            {typeof orderDetails.shippingAddress === 'object' && (
                                              <>
                                                <div>{(orderDetails.shippingAddress as any).name}</div>
                                                <div>{(orderDetails.shippingAddress as any).address}</div>
                                                <div>
                                                  {(orderDetails.shippingAddress as any).city}, {(orderDetails.shippingAddress as any).state} {(orderDetails.shippingAddress as any).zipCode}
                                                </div>
                                                <div>{(orderDetails.shippingAddress as any).email}</div>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <Separator />
                                    
                                    {/* Order Items */}
                                    <div>
                                      <h4 className="font-semibold mb-4 flex items-center">
                                        <Package className="w-4 h-4 mr-1" />
                                        Order Items
                                      </h4>
                                      <div className="space-y-3">
                                        {orderDetails.orderItems?.map((item) => (
                                          <div key={item.id} className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
                                            <img 
                                              src={item.product.imageUrl || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
                                              alt={item.product.name} 
                                              className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                              <div className="font-medium">{item.product.name}</div>
                                              <div className="text-sm text-muted-foreground">
                                                Quantity: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                                              </div>
                                            </div>
                                            <div className="font-semibold">
                                              ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="flex justify-between items-center text-sm">
                          <div className="text-muted-foreground">
                            {order.shippingAddress && typeof order.shippingAddress === 'object' && order.shippingAddress.name
                              ? `Shipping to ${order.shippingAddress.name}`
                              : 'Shipping address on file'
                            }
                          </div>
                          <div className="font-semibold">
                            Total: ${parseFloat(order.total).toFixed(2)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
