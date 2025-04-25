// src/components/MobileNav.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const MobileNav: React.FC = () => {
  const navLinks = [
    { to: '/admin/dashboard', icon: "home", label: 'Dashboard' },
    { to: '/admin/products', icon: "shopping_bag", label: 'Products' },
    { to: '/admin/orders', icon: "shopping_cart", label: 'Orders' },
    { to: '/admin/users', icon: "person", label: 'Users' },
    { to: '/admin/settings', icon: "settings", label: 'Settings' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center h-full px-2 ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`
            }
          >
            <span className="mb-1 mdi">{link.icon}</span>
            <span className="text-xs">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;