
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-devops-blue"
            >
              <path d="M18 16h.01"></path>
              <path d="M18 20h.01"></path>
              <path d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
              <path d="M10 14.66v3.09a2.25 2.25 0 0 0 .293 1.12l.427.711a2.25 2.25 0 0 0 3.56 0l.427-.711a2.25 2.25 0 0 0 .293-1.12v-3.09a2.25 2.25 0 0 0-1.12-1.94l-1.38-.69a2.25 2.25 0 0 0-2 0l-1.38.69a2.25 2.25 0 0 0-1.12 1.94z"></path>
            </svg>
            <span className="font-bold text-xl">DevOps<span className="text-devops-blue">Wizard</span></span>
          </Link>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            <ThemeToggle />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-devops-blue flex items-center justify-center text-white font-semibold mr-2">
                      {user?.name.charAt(0) || 'U'}
                    </div>
                    <span>{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/me">Profile Details</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/credentials">Configuration</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/instance">My Instance</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/subscription">Subscription</Link>
                  </DropdownMenuItem>
                  {user?.isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/signin">Login</Link>
              </Button>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-2">
            <ThemeToggle />
            <button 
              className="text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="12" y2="12"></line>
                  <line x1="4" x2="20" y1="6" y2="6"></line>
                  <line x1="4" x2="20" y1="18" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <nav className="flex flex-col p-4 space-y-4">
            <Link to="/" className="text-foreground hover:text-foreground/80 transition-colors">Home</Link>
            <Link to="/about" className="text-foreground hover:text-foreground/80 transition-colors">About</Link>
            <Link to="/contact" className="text-foreground hover:text-foreground/80 transition-colors">Contact</Link>
            {isAuthenticated ? (
              <>
                <div className="py-2 border-t border-border">
                  <Link to="/dashboard" className="block py-2 text-foreground hover:text-foreground/80 transition-colors">Dashboard</Link>
                  <Link to="/me" className="block py-2 text-foreground hover:text-foreground/80 transition-colors">Profile Details</Link>
                  <Link to="/credentials" className="block py-2 text-foreground hover:text-foreground/80 transition-colors">Configuration</Link>
                  <Link to="/profile" className="block py-2 text-foreground hover:text-foreground/80 transition-colors">Settings</Link>
                  <Link to="/instance" className="block py-2 text-foreground hover:text-foreground/80 transition-colors">My Instance</Link>
                  <Link to="/subscription" className="block py-2 text-foreground hover:text-foreground/80 transition-colors">Subscription</Link>
                  {user?.isAdmin && (
                    <Link to="/admin" className="block py-2 text-foreground hover:text-foreground/80 transition-colors">Admin Dashboard</Link>
                  )}
                </div>
                <Button variant="outline" onClick={logout}>Logout</Button>
              </>
            ) : (
              <Button asChild className="w-full">
                <Link to="/signin">Login</Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
