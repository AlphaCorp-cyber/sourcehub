import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Box, 
  Search, 
  ShoppingCart, 
  User, 
  Package, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: cartItems } = useQuery({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const cartItemCount = cartItems?.length || 0;

  const handleSignOut = () => {
    window.location.href = "/api/logout";
  };

  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Box className="w-4 h-4 text-white" />
          </div>
          <span 
            className="text-xl font-bold gradient-text cursor-pointer"
            onClick={() => window.location.href = "/"}
            data-testid="link-logo"
          >
            SourceHub
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a 
            href="/products" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-products"
          >
            Products
          </a>
          <a 
            href="/#request" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-request"
          >
            Request
          </a>
          <a 
            href="/#how-it-works" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-how-it-works"
          >
            How it Works
          </a>
          <a 
            href="/#support" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-support"
          >
            Support
          </a>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            data-testid="button-search"
          >
            <Search className="w-4 h-4 text-muted-foreground" />
          </Button>

          {/* Cart */}
          {isAuthenticated && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 hover:bg-muted rounded-lg transition-colors relative"
              onClick={() => window.location.href = "/cart"}
              data-testid="button-cart"
            >
              <ShoppingCart className="w-4 h-4 text-muted-foreground" />
              {cartItemCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full min-w-5 h-5 text-xs flex items-center justify-center"
                  data-testid="badge-cart-count"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          )}

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="button-user-menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                    <AvatarFallback>
                      {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user?.firstName && (
                      <p className="font-medium" data-testid="text-user-name">
                        {user.firstName} {user.lastName}
                      </p>
                    )}
                    <p className="w-[200px] truncate text-sm text-muted-foreground" data-testid="text-user-email">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => window.location.href = "/orders"}
                  data-testid="menu-item-orders"
                >
                  <Package className="mr-2 h-4 w-4" />
                  <span>My Orders</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => window.location.href = "/profile"}
                  data-testid="menu-item-profile"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                {user?.isAdmin && (
                  <DropdownMenuItem 
                    onClick={() => window.location.href = "/admin"}
                    data-testid="menu-item-admin"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  data-testid="menu-item-signout"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={handleSignIn}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-signin"
            >
              Sign In
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <a 
              href="/products" 
              className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-link-products"
            >
              Products
            </a>
            <a 
              href="/#request" 
              className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-link-request"
            >
              Request
            </a>
            <a 
              href="/#how-it-works" 
              className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-link-how-it-works"
            >
              How it Works
            </a>
            <a 
              href="/#support" 
              className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-link-support"
            >
              Support
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
