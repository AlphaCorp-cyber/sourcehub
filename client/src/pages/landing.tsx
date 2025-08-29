import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  Search,
  ShoppingCart,
  Play,
  Sparkles,
  Check,
  Star,
  Boxes,
  ChartLine,
  MessageSquare,
  CreditCard,
  Truck,
  Shield,
  Clock,
  NotebookPen,
  ArrowRight,
  Box,
  UserPlus,
  Phone,
} from "lucide-react";

export default function Landing() {
  useEffect(() => {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const featuredProducts = [
    {
      id: "1",
      name: "Premium Wireless Earbuds",
      description: "High-quality audio with noise cancellation",
      price: "$89.99",
      imageUrl: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      category: "Electronics",
      rating: 5
    },
    {
      id: "2",
      name: "Smart Fitness Watch",
      description: "Advanced health tracking and GPS",
      price: "$199.99",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      category: "Wearables",
      rating: 4
    },
    {
      id: "3",
      name: "Premium Backpack",
      description: "Luxury leather with laptop compartment",
      price: "$149.99",
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      category: "Fashion",
      rating: 5
    },
    {
      id: "4",
      name: "Desk Accessories Set",
      description: "Minimalist design for modern workspace",
      price: "$79.99",
      imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      category: "Home & Office",
      rating: 4
    }
  ];

  const testimonials = [
    {
      name: "Michael Chen",
      role: "Business Owner",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      content: "SourceHub found the exact product I needed at 40% less than retail price. The quality exceeded my expectations!",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "Freelancer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      content: "The custom product request feature is amazing. They sourced specialty equipment I couldn't find anywhere else.",
      rating: 5
    },
    {
      name: "David Rodriguez",
      role: "Startup Founder",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      content: "Fast shipping, great prices, and excellent customer service. SourceHub has become my go-to platform.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-16 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-muted"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--primary)/10,_transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-on-scroll">
              <div className="space-y-4">
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Sourcing Made Simple
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Premium Products
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block">
                    Direct from Source
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Access global suppliers, request custom products, and enjoy hassle-free delivery. 
                  Experience the future of international sourcing.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-shop-now"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Shop Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="font-semibold text-lg"
                  data-testid="button-how-it-works"
                >
                  <Play className="w-5 h-5 mr-2" />
                  How it Works
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground" data-testid="text-products-count">10K+</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground" data-testid="text-customers-count">50K+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground" data-testid="text-success-rate">99%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="relative animate-on-scroll">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Modern workspace with laptop showing ecommerce dashboard" 
                  className="rounded-2xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-500"
                  data-testid="img-hero-workspace"
                />
                
                {/* Floating feature cards */}
                <Card className="absolute -top-4 -left-4 p-4 shadow-lg backdrop-blur-md bg-card/80 border-border/50">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm" data-testid="text-order-confirmed">Order Confirmed</div>
                        <div className="text-xs text-muted-foreground">Just now</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="absolute -bottom-4 -right-4 p-4 shadow-lg backdrop-blur-md bg-card/80 border-border/50">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Truck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm" data-testid="text-free-shipping">Free Shipping</div>
                        <div className="text-xs text-muted-foreground">Worldwide</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold mb-4" data-testid="text-featured-products-title">Featured Products</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of premium products sourced directly from verified suppliers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="group overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-on-scroll"
                data-testid={`card-product-${product.id}`}
              >
                <div className="relative">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    data-testid={`img-product-${product.id}`}
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-accent/10 text-accent">
                      {product.category}
                    </Badge>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < product.rating ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2" data-testid={`text-product-name-${product.id}`}>
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4" data-testid={`text-product-description-${product.id}`}>
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
                      {product.price}
                    </span>
                    <Button 
                      size="sm" 
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      data-testid={`button-add-to-cart-${product.id}`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
              data-testid="button-view-all-products"
            >
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Request Product Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-on-scroll">
              <div className="space-y-4">
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Custom Orders
                </Badge>
                <h2 className="text-4xl font-bold">
                  Can't Find What You Need?
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block">
                    Request Any Product
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Send us a link, description, or image of any product you want. Our sourcing experts will find it, 
                  negotiate the best price, and deliver it to your door.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Search className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Expert Sourcing</h3>
                    <p className="text-muted-foreground">Our team finds the best suppliers and negotiates competitive prices.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Quality Guaranteed</h3>
                    <p className="text-muted-foreground">Every product is verified for quality before shipping.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Fast Response</h3>
                    <p className="text-muted-foreground">Get a quote within 24 hours of your request.</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-8 shadow-lg animate-on-scroll">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-6" data-testid="text-request-product-title">Request a Product</h3>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Link or Description</label>
                    <Textarea 
                      placeholder="Paste a product link or describe what you're looking for..."
                      className="resize-none"
                      rows={4}
                      data-testid="textarea-product-description"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Quantity</label>
                      <Input 
                        type="number" 
                        placeholder="1"
                        data-testid="input-quantity"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Budget Range</label>
                      <Select>
                        <SelectTrigger data-testid="select-budget-range">
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-50">Under $50</SelectItem>
                          <SelectItem value="50-100">$50 - $100</SelectItem>
                          <SelectItem value="100-500">$100 - $500</SelectItem>
                          <SelectItem value="500-plus">$500+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Email</label>
                    <Input 
                      type="email" 
                      placeholder="your@email.com"
                      data-testid="input-email"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                    data-testid="button-submit-request"
                  >
                    <NotebookPen className="w-5 h-5 mr-2" />
                    Submit Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold mb-4" data-testid="text-how-it-works-title">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From browsing to delivery, we've streamlined every step of the process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center space-y-4 animate-on-scroll">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold" data-testid="text-step-1-title">Browse & Discover</h3>
              <p className="text-muted-foreground">
                Explore our curated collection or request any product you can't find in our catalog.
              </p>
            </div>
            <div className="text-center space-y-4 animate-on-scroll">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold" data-testid="text-step-2-title">Secure Checkout</h3>
              <p className="text-muted-foreground">
                Pay securely with Stripe. Your payment is protected until you receive your order.
              </p>
            </div>
            <div className="text-center space-y-4 animate-on-scroll">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold" data-testid="text-step-3-title">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Track your order in real-time and receive it at your doorstep with free worldwide shipping.
              </p>
            </div>
          </div>

          {/* Interactive process flow */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 p-8">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">1</div>
                  <span className="font-semibold">Sign Up</span>
                </div>
                <div className="hidden md:block text-border">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">2</div>
                  <span className="font-semibold">Shop or Request</span>
                </div>
                <div className="hidden md:block text-border">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">3</div>
                  <span className="font-semibold">Pay & Track</span>
                </div>
                <div className="hidden md:block text-border">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold">
                    <Check className="w-6 h-6" />
                  </div>
                  <span className="font-semibold">Delivered</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Admin Dashboard Preview */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold mb-4" data-testid="text-admin-dashboard-title">Powerful Admin Dashboard</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for managing products, orders, and customer requests with ease.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 shadow-lg animate-on-scroll">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Boxes className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Product Management</h3>
                </div>
                <p className="text-muted-foreground mb-6">Add, edit, and manage your product catalog with drag-and-drop image uploads and rich descriptions.</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Bulk product import
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Image optimization
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Inventory tracking
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-lg animate-on-scroll">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <ChartLine className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Order Analytics</h3>
                </div>
                <p className="text-muted-foreground mb-6">Track sales, monitor performance, and gain insights with comprehensive analytics and reporting.</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Real-time dashboards
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Revenue tracking
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Export reports
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-lg animate-on-scroll">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Request Management</h3>
                </div>
                <p className="text-muted-foreground mb-6">Handle customer product requests, provide quotes, and convert inquiries into sales seamlessly.</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Automated notifications
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Quote generation
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Customer communication
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold mb-4" data-testid="text-testimonials-title">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us for their sourcing needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 shadow-lg animate-on-scroll" data-testid={`card-testimonial-${index}`}>
                <CardContent className="p-0">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6" data-testid={`text-testimonial-content-${index}`}>
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={testimonial.avatar} 
                      alt={`${testimonial.name} testimonial`} 
                      className="w-12 h-12 rounded-full object-cover"
                      data-testid={`img-testimonial-avatar-${index}`}
                    />
                    <div>
                      <div className="font-semibold" data-testid={`text-testimonial-name-${index}`}>{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground" data-testid={`text-testimonial-role-${index}`}>{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-accent">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8 animate-on-scroll">
            <h2 className="text-4xl lg:text-5xl font-bold text-white" data-testid="text-cta-title">
              Ready to Start Sourcing?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join thousands of businesses and individuals who save time and money with our intelligent sourcing platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-create-account"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Create Free Account
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 font-semibold"
                data-testid="button-talk-to-sales"
              >
                <Phone className="w-5 h-5 mr-2" />
                Talk to Sales
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-8 pt-8 text-white/70">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Free shipping worldwide</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
