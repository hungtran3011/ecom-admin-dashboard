import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export interface ActionItem {
  label: string;
  icon?: string;
  onClick: () => void;
  disabled?: boolean;
}

interface ActionGroupItem {
  groupLabel?: string;
  items: ActionItem[];
}

interface ActionsDropdownProps {
  groups: ActionGroupItem[];
  isLoading?: boolean;
  loadingLabel?: string;
  triggerIcon?: string;
}

export const ActionsDropdown: React.FC<ActionsDropdownProps> = ({
  groups,
  isLoading = false,
  loadingLabel = 'Loading...',
  triggerIcon = 'more_vert'
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="text-gray-600 hover:text-gray-900"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="mdi animate-spin">sync</span>
          ) : (
            <span className="mdi">{triggerIcon}</span>
          )}
        </button>
      </DropdownMenu.Trigger>
      
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white shadow-lg border border-gray-200 rounded-md py-1 min-w-[160px] z-50"
          sideOffset={5}
          align="end"
        >
          {groups.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {group.groupLabel && (
                <DropdownMenu.Label className="px-3 py-2 text-xs text-gray-500">
                  {group.groupLabel}
                </DropdownMenu.Label>
              )}
              
              {group.items.map((item, itemIndex) => (
                <DropdownMenu.Item
                  key={itemIndex}
                  onSelect={item.onClick}
                  disabled={item.disabled}
                  className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {item.icon && <span className="mdi mr-1 text-sm">{item.icon}</span>}
                  {item.label}
                </DropdownMenu.Item>
              ))}
              
              {groupIndex < groups.length - 1 && (
                <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
              )}
            </React.Fragment>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};