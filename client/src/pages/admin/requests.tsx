import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  MessageSquare,
  Calendar,
  DollarSign,
  User,
  Mail,
  Package,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import type { ProductRequest } from "@shared/schema";

export default function AdminRequests() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<ProductRequest | null>(null);
  const [responseForm, setResponseForm] = useState<{
    adminResponse: string;
    quotedPrice: string;
    status: "quoted" | "rejected";
  }>({
    adminResponse: "",
    quotedPrice: "",
    status: "quoted",
  });

  const { data: requests, isLoading } = useQuery<ProductRequest[]>({
    queryKey: ["/api/admin/product-requests"],
    enabled: !!user?.isAdmin,
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ProductRequest> }) => {
      const response = await apiRequest("PUT", `/api/admin/product-requests/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/product-requests"] });
      setSelectedRequest(null);
      setResponseForm({
        adminResponse: "",
        quotedPrice: "",
        status: "quoted",
      });
      toast({
        title: "Request Updated",
        description: "Product request has been successfully updated.",
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
        description: "Failed to update product request. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter requests
  const filteredRequests = requests?.filter(request => {
    const matchesSearch = request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'quoted':
        return <DollarSign className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    const updates = {
      adminResponse: responseForm.adminResponse,
      quotedPrice: responseForm.quotedPrice ? parseFloat(responseForm.quotedPrice).toString() : null,
      status: responseForm.status,
    };

    updateRequestMutation.mutate({ id: selectedRequest.id, updates });
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
                <h1 className="text-3xl font-bold mb-2" data-testid="text-requests-management-title">
                  Product Requests
                </h1>
                <p className="text-muted-foreground">
                  Manage customer product requests and provide quotes
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
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-requests"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48" data-testid="select-status-filter">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Requests */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-48"></div>
                          <div className="h-4 bg-muted rounded w-32"></div>
                        </div>
                        <div className="h-6 bg-muted rounded w-20"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredRequests.length === 0 ? (
              <Card className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2" data-testid="text-no-requests">
                  {searchQuery || statusFilter !== "all" ? "No requests found" : "No product requests yet"}
                </h2>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all" 
                    ? "Try adjusting your search criteria." 
                    : "Customer product requests will appear here."}
                </p>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold" data-testid="text-requests-count">
                    {filteredRequests.length} Requests
                  </h2>
                </div>

                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <Card key={request.id} className="hover:shadow-md transition-shadow" data-testid={`card-request-${request.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold line-clamp-1" data-testid={`text-request-description-${request.id}`}>
                                {request.description.slice(0, 80)}...
                              </h3>
                              <Badge className={`${getStatusColor(request.status || 'pending')} flex items-center space-x-1`} data-testid={`badge-request-status-${request.id}`}>
                                {getStatusIcon(request.status || 'pending')}
                                <span>{(request.status || 'pending').charAt(0).toUpperCase() + (request.status || 'pending').slice(1)}</span>
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span>{request.email}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{format(new Date(request.createdAt || ''), 'MMM dd, yyyy')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Package className="w-4 h-4" />
                                <span>Qty: {request.quantity}</span>
                              </div>
                              {request.budgetRange && (
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="w-4 h-4" />
                                  <span>{request.budgetRange}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedRequest(request)}
                                data-testid={`button-view-request-${request.id}`}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                {request.status === 'pending' ? 'Respond' : 'View'}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Product Request Details</DialogTitle>
                              </DialogHeader>
                              
                              {selectedRequest && (
                                <div className="space-y-6">
                                  {/* Request Info */}
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Request Information</h4>
                                      <div className="space-y-1 text-sm">
                                        <div><strong>Email:</strong> {selectedRequest.email}</div>
                                        <div><strong>Date:</strong> {format(new Date(selectedRequest.createdAt || ''), 'MMM dd, yyyy HH:mm')}</div>
                                        <div><strong>Quantity:</strong> {selectedRequest.quantity}</div>
                                        {selectedRequest.budgetRange && (
                                          <div><strong>Budget:</strong> {selectedRequest.budgetRange}</div>
                                        )}
                                        <div>
                                          <strong>Status:</strong> 
                                          <Badge className={`ml-2 ${getStatusColor(selectedRequest.status)}`}>
                                            {selectedRequest.status}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {selectedRequest.quotedPrice && (
                                      <div>
                                        <h4 className="font-semibold mb-2">Quote Information</h4>
                                        <div className="text-sm">
                                          <div><strong>Quoted Price:</strong> ${parseFloat(selectedRequest.quotedPrice).toFixed(2)}</div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <Separator />
                                  
                                  {/* Product Description */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Product Description</h4>
                                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                                      {selectedRequest.description}
                                    </p>
                                  </div>

                                  {selectedRequest.adminResponse && (
                                    <>
                                      <Separator />
                                      <div>
                                        <h4 className="font-semibold mb-2">Previous Response</h4>
                                        <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                                          {selectedRequest.adminResponse}
                                        </p>
                                      </div>
                                    </>
                                  )}
                                  
                                  <Separator />
                                  
                                  {/* Response Form */}
                                  <form onSubmit={handleSubmitResponse} className="space-y-4">
                                    <h4 className="font-semibold">Respond to Request</h4>
                                    
                                    <div>
                                      <Label htmlFor="adminResponse">Response Message</Label>
                                      <Textarea
                                        id="adminResponse"
                                        placeholder="Provide details about the product availability, sourcing, and any additional information..."
                                        value={responseForm.adminResponse}
                                        onChange={(e) => setResponseForm(prev => ({ ...prev, adminResponse: e.target.value }))}
                                        required
                                        rows={4}
                                        data-testid="textarea-admin-response"
                                      />
                                    </div>
                                    
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="quotedPrice">Quoted Price (Optional)</Label>
                                        <Input
                                          id="quotedPrice"
                                          type="number"
                                          step="0.01"
                                          placeholder="0.00"
                                          value={responseForm.quotedPrice}
                                          onChange={(e) => setResponseForm(prev => ({ ...prev, quotedPrice: e.target.value }))}
                                          data-testid="input-quoted-price"
                                        />
                                      </div>
                                      
                                      <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select 
                                          value={responseForm.status} 
                                          onValueChange={(value: "quoted" | "rejected") => setResponseForm(prev => ({ ...prev, status: value }))}
                                        >
                                          <SelectTrigger data-testid="select-response-status">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="quoted">Quoted</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    
                                    <div className="flex space-x-3 pt-4">
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="flex-1"
                                        onClick={() => setSelectedRequest(null)}
                                        data-testid="button-cancel-response"
                                      >
                                        Cancel
                                      </Button>
                                      <Button 
                                        type="submit" 
                                        className="flex-1"
                                        disabled={updateRequestMutation.isPending}
                                        data-testid="button-submit-response"
                                      >
                                        {updateRequestMutation.isPending ? "Sending..." : "Send Response"}
                                      </Button>
                                    </div>
                                  </form>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="text-sm">
                          <p className="text-muted-foreground line-clamp-2 mb-2">
                            {request.description}
                          </p>
                          {request.adminResponse && (
                            <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <MessageSquare className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-900 dark:text-blue-100">Admin Response:</span>
                              </div>
                              <p className="text-blue-800 dark:text-blue-200 text-sm">
                                {request.adminResponse}
                              </p>
                              {request.quotedPrice && (
                                <div className="mt-2 text-blue-900 dark:text-blue-100 font-semibold">
                                  Quote: ${parseFloat(request.quotedPrice).toFixed(2)}
                                </div>
                              )}
                            </div>
                          )}
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
