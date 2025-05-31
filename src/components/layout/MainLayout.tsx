
import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showFooter = true }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pb-16">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
