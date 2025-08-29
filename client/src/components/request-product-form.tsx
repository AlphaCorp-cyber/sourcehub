import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NotebookPen, Sparkles } from "lucide-react";

interface RequestProductFormData {
  description: string;
  quantity: number;
  budgetRange: string;
  email: string;
}

export function RequestProductForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<RequestProductFormData>({
    description: '',
    quantity: 1,
    budgetRange: '',
    email: '',
  });

  const submitRequestMutation = useMutation({
    mutationFn: async (data: RequestProductFormData) => {
      const response = await apiRequest("POST", "/api/product-requests", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "Your product request has been submitted successfully. We'll get back to you within 24 hours!",
      });
      // Reset form
      setFormData({
        description: '',
        quantity: 1,
        budgetRange: '',
        email: '',
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
        description: "Failed to submit product request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.description.trim() || !formData.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    submitRequestMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof RequestProductFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl" data-testid="text-request-form-title">
          <Sparkles className="w-6 h-6 mr-2 text-accent" />
          Request a Product
        </CardTitle>
        <p className="text-muted-foreground">
          Can't find what you're looking for? Describe it and we'll source it for you!
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Product Link or Description *
            </Label>
            <Textarea 
              id="description"
              placeholder="Paste a product link or describe what you're looking for in detail..."
              className="resize-none mt-2"
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              data-testid="textarea-product-description"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Include brand, model, specifications, or any specific requirements
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity" className="text-sm font-medium">
                Quantity
              </Label>
              <Input 
                id="quantity"
                type="number" 
                placeholder="1"
                min="1"
                className="mt-2"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                required
                data-testid="input-quantity"
              />
            </div>
            <div>
              <Label htmlFor="budget" className="text-sm font-medium">
                Budget Range
              </Label>
              <Select 
                value={formData.budgetRange} 
                onValueChange={(value) => handleInputChange('budgetRange', value)}
              >
                <SelectTrigger className="mt-2" data-testid="select-budget-range">
                  <SelectValue placeholder="Select your budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-50">Under $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100-500">$100 - $500</SelectItem>
                  <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                  <SelectItem value="1000-plus">$1,000+</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Your Email *
            </Label>
            <Input 
              id="email"
              type="email" 
              placeholder="your@email.com"
              className="mt-2"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              data-testid="input-email"
            />
            <p className="text-xs text-muted-foreground mt-1">
              We'll send you a quote and updates about your request
            </p>
          </div>

          <Button 
            type="submit" 
            size="lg"
            className="w-full bg-gradient-to-r from-accent to-accent/90 text-accent-foreground hover:from-accent/90 hover:to-accent font-semibold transition-all transform hover:scale-[1.02]"
            disabled={submitRequestMutation.isPending}
            data-testid="button-submit-request"
          >
            {submitRequestMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <NotebookPen className="w-5 h-5 mr-2" />
                Submit Request
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              🚀 <strong>Fast Response:</strong> We'll get back to you within 24 hours with availability and pricing
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
