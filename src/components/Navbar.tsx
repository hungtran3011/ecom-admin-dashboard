import React from 'react';
import { Link } from 'react-router-dom';
import { DropdownMenu, Avatar } from '@radix-ui/themes';

const Navbar: React.FC = () => (
  <header className="bg-white shadow p-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold">E-Com Admin</h1>
    <div className="flex items-center gap-4">
      <Link to="/login" className="text-blue-500 hover:underline">
        Login
      </Link>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="focus:outline-none" aria-label="User menu">
          <Avatar
            className="w-8 h-8 rounded-full cursor-pointer"
            src="https://via.placeholder.com/150" // Placeholder image
            alt="User Avatar"
            fallback="U" // Fallback text for the avatar
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          className="bg-white shadow rounded p-2 w-40"
          sideOffset={8} // Ensures proper spacing from the trigger
        >
          <DropdownMenu.Item asChild>
            <button
              className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Profile"
            >
              Profile
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
          <DropdownMenu.Item asChild>
            <button
              className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Logout"
            >
              Logout
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </header>
);

export default Navbar;