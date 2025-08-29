import { Box, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Box className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">SourceHub</span>
            </div>
            <p className="text-muted-foreground">
              Your trusted partner for global sourcing and eCommerce solutions.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                data-testid="link-twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                data-testid="link-linkedin"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                data-testid="link-instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-electronics">Electronics</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-fashion">Fashion</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-home-garden">Home & Garden</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-sports">Sports & Outdoors</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-sourcing">Product Sourcing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-quality">Quality Control</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-shipping">Shipping & Logistics</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-custom">Custom Orders</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-help">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-contact">Contact Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-track">Track Orders</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-returns">Returns</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm" data-testid="text-copyright">
            © 2024 SourceHub. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-muted-foreground mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-privacy">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-terms">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
