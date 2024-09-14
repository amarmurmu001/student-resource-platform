import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-200 p-4 text-center dark:bg-gray-800 dark:text-white">
        © 2023 Student Resource Sharing Platform
      </footer>
    </div>
  );
};

export default Layout;