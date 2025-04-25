import React from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Link } from 'react-router-dom';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/settings', label: 'Settings' },
];

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = React.useState<string | null>(window.location.pathname);
  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };
  return (
  <aside className="hidden md:block w-64 bg-white shadow">
    <div className="p-4 text-xl font-bold">Admin</div>
    <NavigationMenu.Root className="flex flex-col p-2 w-full">
      <NavigationMenu.List className="w-full">
        {links.map((link) => (
          <NavigationMenu.Item key={link.to} className="w-full">
            <NavigationMenu.Link asChild className="w-full p-4">
              <Link
                to={link.to}
                className={`block w-full text-left rounded hover:bg-gray-100 ${
                  activeItem === link.to
                    ? 'bg-gray-200 font-semibold'
                    : 'text-gray-700'
                }`}
                onClick={() => handleItemClick(link.to)}
              >
                {link.label}
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  </aside>
)};

export default Sidebar;