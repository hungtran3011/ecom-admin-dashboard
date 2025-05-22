import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { StatusBadge } from '../ui/StatusBadge';

type UserStatus = 'active' | 'inactive' | 'pending';
type UserRole = 'admin' | 'manager' | 'editor' | 'viewer';

interface UserDetailViewProps {
  user: {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    avatar?: string | null;
    createdAt: string;
    lastLogin?: string | null;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
  onClose: () => void;
  onStatusChange: (newStatus: UserStatus) => void;
  isUpdating: boolean;
}

const UserDetailView: React.FC<UserDetailViewProps> = ({
  user,
  onClose,
  onStatusChange,
  isUpdating
}) => {
  // Format date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="flex items-center">
          <img 
            src={user.avatar || 'https://via.placeholder.com/80'} 
            alt={`${user.name}'s avatar`}
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-200">{user.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-200"
            aria-label="Close"
          >
            <span className="mdi">close</span>
          </button>
        </div>
      </div>

      {/* User Status Bar */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 flex justify-between items-center transition-colors duration-200">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2 transition-colors duration-200">Status:</span>
          <StatusBadge status={user.status} />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={user.status}
            onChange={(e) => onStatusChange(e.target.value as UserStatus)}
            disabled={isUpdating}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          {isUpdating && (
            <span className="mdi animate-spin text-blue-500 dark:text-blue-400 transition-colors duration-200">sync</span>
          )}
        </div>
      </div>

      {/* User Details */}
      <div className="flex-grow overflow-auto p-6 bg-white dark:bg-gray-800 transition-colors duration-200">
        <Tabs.Root defaultValue="profile" className="w-full">
          <Tabs.List className="flex border-b border-gray-200 dark:border-gray-700 mb-4 transition-colors duration-200">
            <Tabs.Trigger
              value="profile"
              className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-b-2 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400 transition-colors duration-200"
            >
              Profile
            </Tabs.Trigger>
            <Tabs.Trigger
              value="activity"
              className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-b-2 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400 transition-colors duration-200"
            >
              Activity
            </Tabs.Trigger>
            <Tabs.Trigger
              value="security"
              className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-b-2 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400 transition-colors duration-200"
            >
              Security
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="profile" className="focus:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-md transition-colors duration-200">
                  <h3 className="font-medium mb-2 text-gray-900 dark:text-white transition-colors duration-200">Basic Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Name:</span> <span className="text-gray-900 dark:text-white transition-colors duration-200">{user.name}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Email:</span> <span className="text-gray-900 dark:text-white transition-colors duration-200">{user.email}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Phone:</span> <span className="text-gray-900 dark:text-white transition-colors duration-200">{user.phone || 'Not provided'}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Role:</span> <span className="text-gray-900 dark:text-white transition-colors duration-200">{user.role}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Joined:</span> <span className="text-gray-900 dark:text-white transition-colors duration-200">{formatDate(user.createdAt)}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-md transition-colors duration-200">
                  <h3 className="font-medium mb-2 text-gray-900 dark:text-white transition-colors duration-200">Address</h3>
                  {user.address ? (
                    <div className="space-y-2">
                      {user.address.street && (
                        <p className="text-sm">
                          <span className="font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Street:</span> <span className="text-gray-900 dark:text-white transition-colors duration-200">{user.address.street}</span>
                        </p>
                      )}
                      {user.address.city && (
                        <p className="text-sm">
                          <span className="font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">City:</span> <span className="text-gray-900 dark:text-white transition-colors duration-200">{user.address.city}</span>
                        </p>
                      )}
                      {user.address.state && (
                        <p className="text-sm">
                          <span className="font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">State:</span> <span className="text-gray-900 dark:text-white transition-colors duration-200">{user.address.state}</span>
                        </p>
                      )}
                      {user.address.zipCode && (
                        <p className="text-sm">
                          <span className="font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Zip Code:</span> <span className="text-gray-900 dark:text-white transition-colors duration-200">{user.address.zipCode}</span>
                        </p>
                      )}
                      {user.address.country && (
                        <p className="text-sm">
                          <span className="font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Country:</span> <span className="text-gray-900 dark:text-white transition-colors duration-200">{user.address.country}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">No address information available</p>
                  )}
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="activity" className="focus:outline-none">
            <div className="bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-md p-4 transition-colors duration-200">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white transition-colors duration-200">Recent Activity</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Last Login:</span> <span className="text-gray-900 dark:text-white transition-colors duration-200">{formatDate(user.lastLogin)}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  Activity log will be displayed here when available
                </p>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="security" className="focus:outline-none">
            <div className="bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-md p-4 transition-colors duration-200">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white transition-colors duration-200">Security Settings</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1 text-gray-800 dark:text-gray-200 transition-colors duration-200">Password</h4>
                  <button
                    className="px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white text-sm font-medium rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                  >
                    Reset Password
                  </button>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1 text-gray-800 dark:text-gray-200 transition-colors duration-200">Two-Factor Authentication</h4>
                  <div className="flex items-center">
                    <span className="h-5 w-5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full flex items-center justify-center mr-2 transition-colors duration-200">
                      <span className="mdi text-xs">close</span>
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">Not enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 transition-colors duration-200">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          Close
        </button>
        <button
          className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white text-sm font-medium rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default UserDetailView;