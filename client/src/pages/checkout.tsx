import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/layout/navbar";
import { ArrowLeft, CreditCard, Shield } from "lucide-react";
import type { CartItem, Product } from "@shared/schema";

type CartItemWithProduct = CartItem & { product: Product };

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ cartItems }: { cartItems: CartItemWithProduct[] }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const createOrderMutation = useMutation({
    mutationFn: async (paymentIntentId: string) => {
      const response = await apiRequest("POST", "/api/create-order", {
        paymentIntentId,
        shippingAddress,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Placed Successfully!",
        description: "Thank you for your purchase. You'll receive a confirmation email shortly.",
      });
      setTimeout(() => {
        window.location.href = "/orders";
      }, 2000);
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
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    // Validate shipping address
    if (!shippingAddress.name || !shippingAddress.email || !shippingAddress.address || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      toast({
        title: "Incomplete Address",
        description: "Please fill in all shipping address fields.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/orders",
      },
      redirect: "if_required",
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else if (paymentIntent?.status === "succeeded") {
      // Create order in our system
      createOrderMutation.mutate(paymentIntent.id);
    }
    
    setIsProcessing(false);
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + (parseFloat(item.product.price) * item.quantity);
    }, 0);
    const tax = subtotal * 0.08;
    return subtotal + tax;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle data-testid="text-shipping-title">Shipping Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={shippingAddress.name}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, name: e.target.value }))}
                required
                data-testid="input-name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={shippingAddress.email}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, email: e.target.value }))}
                required
                data-testid="input-email"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
              required
              data-testid="input-address"
            />
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                required
                data-testid="input-city"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                required
                data-testid="input-state"
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={shippingAddress.zipCode}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                required
                data-testid="input-zipcode"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center" data-testid="text-payment-title">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentElement />
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle data-testid="text-order-total-title">Order Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.product.name} × {item.quantity}</span>
                <span>${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span data-testid="text-checkout-total">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
        <Shield className="w-4 h-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>
      
      <Button 
        type="submit" 
        size="lg" 
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={!stripe || isProcessing || createOrderMutation.isPending}
        data-testid="button-place-order"
      >
        {isProcessing || createOrderMutation.isPending ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {isProcessing ? "Processing..." : `Place Order - $${calculateTotal().toFixed(2)}`}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");

  const { data: cartItems, isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      // Create PaymentIntent as soon as we have cart items
      apiRequest("POST", "/api/create-payment-intent", { cartItems })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
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
            description: "Failed to initialize payment. Please try again.",
            variant: "destructive",
          });
        });
    }
  }, [cartItems, toast]);

  if (isLoading || !cartItems) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
              <div className="h-8 bg-muted rounded w-1/3 mb-8 animate-pulse"></div>
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
              <Card className="p-12 text-center">
                <h1 className="text-2xl font-bold mb-2" data-testid="text-empty-checkout">Your cart is empty</h1>
                <p className="text-muted-foreground mb-6">
                  Add some items to your cart before proceeding to checkout.
                </p>
                <Button 
                  onClick={() => window.location.href = "/products"}
                  data-testid="button-shop-products"
                >
                  Shop Products
                </Button>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p data-testid="text-initializing-payment">Initializing secure payment...</p>
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
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center space-x-4 mb-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.location.href = "/cart"}
                  data-testid="button-back-to-cart"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Cart
                </Button>
              </div>
              <h1 className="text-3xl font-bold" data-testid="text-checkout-title">Checkout</h1>
              <p className="text-muted-foreground">Complete your purchase securely</p>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm cartItems={cartItems} />
              </Elements>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
