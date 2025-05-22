import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import OrderStatusBadge from './OrderStatusBadge';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

interface OrderDetailViewProps {
  order: {
    _id: string;
    orderNumber: string;
    customer: {
      _id: string;
      name: string;
      email: string;
    };
    totalAmount: number;
    status: OrderStatus;
    paymentStatus: 'paid' | 'pending' | 'failed';
    items: Array<{
      product: {
        _id: string;
        name: string;
      };
      quantity: number;
      price: number;
    }>;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  onClose: () => void;
  onStatusChange: (newStatus: OrderStatus) => void;
  isUpdating: boolean;
}

const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  order,
  onClose,
  onStatusChange,
  isUpdating
}) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + '₫';
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate order subtotal
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Order #{order.orderNumber}</h2>
          <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <span className="mdi">close</span>
          </button>
        </div>
      </div>

      {/* Order Status Bar */}
      <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={order.status}
            onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
            disabled={isUpdating}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
          {isUpdating && (
            <span className="mdi animate-spin text-blue-500">sync</span>
          )}
        </div>
      </div>

      {/* Order Details */}
      <div className="flex-grow overflow-auto p-6">
        <Tabs.Root defaultValue="items" className="w-full">
          <Tabs.List className="flex border-b border-gray-200 mb-4">
            <Tabs.Trigger
              value="items"
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-b-2 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
            >
              Items
            </Tabs.Trigger>
            <Tabs.Trigger
              value="customer"
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-b-2 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
            >
              Customer
            </Tabs.Trigger>
            <Tabs.Trigger
              value="shipping"
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-b-2 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
            >
              Shipping
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="items" className="focus:outline-none">
            <div className="space-y-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.product.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="bg-gray-50 rounded-md p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>{formatCurrency(order.totalAmount - subtotal)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-medium">
                  <span>Total:</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="pt-2 flex justify-between text-sm">
                  <span>Payment Status:</span>
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : order.paymentStatus === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="customer" className="focus:outline-none">
            <div className="bg-white rounded-md p-4">
              <h3 className="font-medium mb-2">Customer Information</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {order.customer.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {order.customer.email}
                </p>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="shipping" className="focus:outline-none">
            <div className="bg-white rounded-md p-4">
              <h3 className="font-medium mb-2">Shipping Address</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Street:</span> {order.shippingAddress.street}
                </p>
                <p className="text-sm">
                  <span className="font-medium">City:</span> {order.shippingAddress.city}
                </p>
                <p className="text-sm">
                  <span className="font-medium">State:</span> {order.shippingAddress.state}
                </p>
                <p className="text-sm">
                  <span className="font-medium">ZIP Code:</span> {order.shippingAddress.zipCode}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Country:</span> {order.shippingAddress.country}
                </p>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50"
        >
          Close
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
        >
          <span className="mdi mr-1">print</span>
          Print Order
        </button>
      </div>
    </div>
  );
};

export default OrderDetailView;