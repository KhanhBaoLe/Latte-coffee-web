'use client';
import { useCart } from '@/app/components/CartContext';
import { CartItem } from '@/app/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type DeliveryMethod = 'pickup' | 'delivery';

type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  tableNumber: string;
  note: string;
  deliveryMethod: DeliveryMethod;
  address: string;
};

type OrderData = {
  customerInfo: CustomerInfo;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
};

export default function ConfirmOrder() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const { clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // Sửa tên state
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const storedOrder = sessionStorage.getItem('currentOrder');

    console.log('Stored Order:', storedOrder); // Log dữ liệu để kiểm tra
    if (storedOrder) {
      setOrderData(JSON.parse(storedOrder));
      setIsLoading(false);
    } else {
      router.push('/');
    }
  }, [router]);

  const handleConfirmOrder = async () => {
    try {
      if (!orderData) {
        alert('No order data found. Please try again.');
        return;
      }

      // Validate customer information
      if (!orderData.customerInfo.name || !orderData.customerInfo.email || !orderData.customerInfo.phone) {
        alert('Please provide all required customer information.');
        return;
      }

      if (orderData.customerInfo.deliveryMethod === 'pickup' && !orderData.customerInfo.tableNumber) {
        alert('Please select a table number for pickup orders.');
        return;
      }

      if (orderData.customerInfo.deliveryMethod === 'delivery' && !orderData.customerInfo.address) {
        alert('Please provide a delivery address.');
        return;
      }

      if (!orderData.cartItems || orderData.cartItems.length === 0) {
        alert('Your cart is empty. Please add items before checking out.');
        return;
      }

      if (orderData.customerInfo.deliveryMethod === 'pickup') {
        const tableNumber = Number(orderData.customerInfo.tableNumber);
        if (isNaN(tableNumber) || tableNumber <= 0) {
          alert('Please enter a valid table number.');
          return;
        }
      }

      // Sử dụng state processing riêng cho thao tác thanh toán
      setIsProcessing(true);

      const checkoutData = {
        tableId: orderData.customerInfo.deliveryMethod === 'pickup'
          ? `table${orderData.customerInfo.tableNumber}`
          : undefined, // tableId is now formatted as "tableX"
        items: orderData.cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          milk: item.milk, 
          drink: item.drink,
          toppings: item.toppings
        })),
        total: orderData.total,
        paymentMethod: 'CASH',
        deliveryMethod: orderData.customerInfo.deliveryMethod.toUpperCase(),
        address: orderData.customerInfo.deliveryMethod === 'delivery' 
          ? orderData.customerInfo.address 
          : undefined,
        customer: {
          name: orderData.customerInfo.name,
          email: orderData.customerInfo.email,
          phone: orderData.customerInfo.phone,
          note: orderData.customerInfo.note,
        }
      };

      console.log('Checkout Data:', checkoutData); // Log dữ liệu trước khi gửi API

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData)
      });

      const result = await response.json();

      // Kiểm tra cả status code và success flag
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to process order');
      }

      // Xử lý thành công
      setIsConfirmed(true);
      clearCart();
      sessionStorage.removeItem('currentOrder');
      
      // KHÔNG dùng alert() mà cập nhật giao diện
      console.log('Order placed successfully!');
    } catch (error) {
      console.error('Error processing order:', error);
      const errorMessage = error instanceof Error ? error.message : 'There was an error processing your order. Please try again.';
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFEBE9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D4037] mx-auto"></div>
          <p className="mt-4 text-[#5D4037]">Loading order information...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFEBE9]">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#5D4037] mb-4">Order Not Found</h2>
          <p className="text-[#8D6E63] mb-6">Sorry, we could not find your order details.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#5D4037] text-white px-6 py-3 rounded-lg hover:bg-[#4E342E] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { customerInfo, cartItems, subtotal, tax, total } = orderData;
  const steps = [
    { id: 1, name: 'Order Overview', status: 'complete' },
    { id: 2, name: 'Confirm Order', status: isConfirmed ? 'complete' : 'current' },
    { id: 3, name: 'Complete Order', status: isConfirmed ? 'current' : 'upcoming' },
  ];

  return (
    <div className="min-h-screen bg-[#EFEBE9]">
      {/* Header with Steps */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-4 px-6">
            <nav className="flex items-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  {index > 0 && (
                    <div
                      className={`h-px w-16 mx-2 ${step.status === 'current'
                        ? 'bg-[#5D4037]'
                        : step.status === 'complete'
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                        }`}
                    />
                  )}
                  <div className="flex items-center">
                    <span
                      className={`w-8 h-8 flex items-center justify-center rounded-full mr-2 
                        ${step.status === 'complete'
                          ? 'bg-green-500 text-white'
                          : step.status === 'current'
                            ? 'border-2 border-[#5D4037] text-[#5D4037]'
                            : 'border-2 border-gray-300 text-gray-400'
                        }`}
                    >
                      {step.status === 'complete' ? '✓' : step.id}
                    </span>
                    <span
                      className={
                        step.status === 'complete'
                          ? 'text-green-500'
                          : step.status === 'current'
                            ? 'text-[#5D4037] font-semibold'
                            : 'text-gray-400'
                      }
                    >
                      {step.name}
                    </span>
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#3E2723]">
            {isConfirmed ? 'Order Confirmed!' : 'Confirm Your Order'}
          </h1>
          <p className="text-[#8D6E63] mt-2">
            {isConfirmed
              ? `Thank you for your order, ${customerInfo.name}`
              : 'Please review your order details before confirming'}
          </p>
          <div className="mt-4 flex justify-center">
            <div className="w-24 h-1 bg-[#D7CCC8] rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#D7CCC8]">
            <h2 className="text-xl font-semibold text-[#3E2723] mb-4 pb-2 border-b border-[#E8D5B5]">
              Order Summary
            </h2>

            <div className="max-h-[500px] overflow-y-auto pr-2 mb-4">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={[
                      item.id,
                      item.size,
                      item.milk,
                      item.drink,
                      Array.isArray(item.toppings) ? item.toppings.join('-') : ''
                    ].join('-')}
                    className="flex items-start py-4 border-b border-[#E8D5B5] last:border-0"
                  >
                    <div className="flex-shrink-0 mr-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-[#D7CCC8]">
                        <Image
                          src={item.image || '/images/matchalate.webp'}
                          alt={item.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="80px"
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#3E2723]">{item.name}</p>
                      <div className="mt-1 text-sm text-[#8D6E63] space-y-1">
                        {item.size && (
                          <p className="flex items-center">
                            <span className="w-16">Size:</span> {item.size}
                          </p>
                        )}
                        {item.milk && (
                          <p className="flex items-center">
                            <span className="w-16">Milk:</span> {item.milk}
                          </p>
                        )}
                        {item.drink && (
                          <p className="flex items-center">
                            <span className="w-16">Drink:</span> {item.drink}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end ml-4">
                      <p className="font-medium text-[#3E2723] whitespace-nowrap">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-[#8D6E63]">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-[#D7CCC8] pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#5D4037]">Subtotal:</span>
                <span className="font-medium text-[#3E2723]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#5D4037]">Tax (10%):</span>
                <span className="font-medium text-[#3E2723]">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-lg mt-4 pt-2 border-t border-[#D7CCC8]">
                <span className="text-[#3E2723]">Total:</span>
                <span className="text-[#3E2723]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-[#D7CCC8]">
              <h2 className="text-xl font-semibold text-[#3E2723] mb-4 pb-2 border-b border-[#E8D5B5]">
                Customer Information
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#8D6E63]">Delivery Method</p>
                  <p className="font-medium text-[#3E2723] capitalize">
                    {customerInfo.deliveryMethod}
                  </p>
                </div>

                {customerInfo.deliveryMethod === 'pickup' ? (
                  <div>
                    <p className="text-sm text-[#8D6E63]">Table Number</p>
                    <p className="font-medium text-[#3E2723]">
                      {customerInfo.tableNumber || 'Not specified'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-[#8D6E63]">Delivery Address</p>
                    <p className="font-medium text-[#3E2723]">
                      {customerInfo.address || 'Not specified'}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-[#8D6E63]">Full Name</p>
                  <p className="font-medium text-[#3E2723]">{customerInfo.name}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#8D6E63]">Email</p>
                    <p className="font-medium text-[#3E2723] break-all">{customerInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8D6E63]">Phone Number</p>
                    <p className="font-medium text-[#3E2723]">{customerInfo.phone}</p>
                  </div>
                </div>

                {customerInfo.note && (
                  <div>
                    <p className="text-sm text-[#8D6E63]">Order Notes</p>
                    <p className="font-medium text-[#3E2723] whitespace-pre-line">
                      {customerInfo.note}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-[#8D6E63]">Payment Method</p>
                  <p className="font-medium text-[#3E2723]">Cash on Delivery (COD)</p>
                </div>
              </div>
            </div>

            {isConfirmed ? (
              <>
                <div className="bg-green-50 rounded-xl shadow-lg p-6 border border-green-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-green-800">Order Confirmed</h3>
                      <p className="mt-2 text-green-700">
                        {customerInfo.deliveryMethod === 'pickup'
                          ? 'Your order will be ready for pickup shortly. Please present your order confirmation at the counter.'
                          : 'Your order is being prepared and will be delivered to your address shortly.'}
                      </p>
                      <p className="mt-3 text-green-700">
                        We have sent a confirmation email to {customerInfo.email}.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-[#5D4037] text-white py-3 rounded-xl hover:bg-[#4E342E] transition-colors font-semibold shadow-lg text-lg"
                >
                  Back to Home
                </button>
              </>
            ) : (
              <button
                onClick={handleConfirmOrder}
                disabled={isProcessing}
                className={`w-full bg-[#5D4037] text-white py-3 rounded-xl font-semibold shadow-lg text-lg ${
                  isProcessing ? 'opacity-75 cursor-not-allowed' : 'hover:bg-[#4E342E] transition-colors'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  `Confirm Order ($${total.toFixed(2)})`
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}