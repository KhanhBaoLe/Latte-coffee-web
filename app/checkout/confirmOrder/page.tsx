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
  tableNumber?: string;
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
  mode: 'qr' | 'web';
};

type CheckoutApiResponse = {
  success: boolean;
  message?: string;
  orderId?: string;
};

export default function ConfirmOrder() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const { clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const storedOrder = sessionStorage.getItem('currentOrder');
    const pathname = window.location.pathname;

    if (storedOrder) {
      const parsedOrder: OrderData = JSON.parse(storedOrder);
      
      if (!pathname.startsWith('/table/') && parsedOrder.mode === 'qr') {
        console.warn('Overriding order mode from QR to Web due to direct /checkout/confirmOrder access with stale QR data.');
        parsedOrder.mode = 'web';
        parsedOrder.customerInfo.tableNumber = undefined;
      }

      setOrderData(parsedOrder);
      setIsLoading(false);
    } else {
      router.push('/');
    }
  }, [router]);

  const handleConfirmOrder = async () => {
    let result: CheckoutApiResponse;
    if (!orderData) {
      alert('No order data found. Please try again.');
      return;
    }

    // Validation checks
    if (!orderData.customerInfo.name || !orderData.customerInfo.email || !orderData.customerInfo.phone) {
      alert('Please provide all required customer information.');
      return;
    }

    // Only validate table number if in QR mode and pickup delivery
    if (orderData.mode === 'qr' && orderData.customerInfo.deliveryMethod === 'pickup' && !orderData.customerInfo.tableNumber) {
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

    setIsProcessing(true);

    try {
      const checkoutData = {
        tableId: orderData.customerInfo.deliveryMethod === 'pickup'
          ? `table${orderData.customerInfo.tableNumber}`
          : undefined,
        items: orderData.cartItems.map(item => ({
          id: item.id,
          title: item.title,
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
        },
        mode: orderData.mode,
      };

      console.log('Sending checkout data to API:', checkoutData);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData)
      });

      result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.message || 'Có lỗi xảy ra khi xử lý đơn hàng của bạn. Vui lòng thử lại.');
        setIsProcessing(false);
        return;
      }

      // Store order details for confirmation page
      const orderDetails = {
        orderId: result.orderId || `DH${Date.now()}`,
        customerName: orderData.customerInfo.name,
        customerEmail: orderData.customerInfo.email,
        total: orderData.total,
        deliveryMethod: orderData.customerInfo.deliveryMethod,
        tableNumber: orderData.customerInfo.tableNumber,
        timestamp: new Date().toISOString()
      };
      
      sessionStorage.setItem('orderConfirmation', JSON.stringify(orderDetails));
      clearCart();
      sessionStorage.removeItem('currentOrder');
      sessionStorage.removeItem('qrTable');
      setIsConfirmed(true);
      router.push('/confirm');
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Đã xảy ra lỗi mạng. Vui lòng kiểm tra kết nối internet của bạn và thử lại.');
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
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-[#5D4037] mb-4">Order Not Found</h2>
          <p className="text-[#8D6E63] mb-6">Sorry, we could not find your order details.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#5D4037] text-white px-6 py-3 rounded-lg hover:bg-[#4E342E] transition-colors w-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { customerInfo, cartItems, subtotal, tax, total, mode } = orderData;
  const steps = [
    { id: 1, name: 'Order Overview', status: 'complete' },
    { id: 2, name: 'Confirm Order', status: isConfirmed ? 'complete' : 'current' },
    { id: 3, name: 'Complete Order', status: isConfirmed ? 'current' : 'upcoming' },
  ];

  return (
    <div className="min-h-screen bg-[#EFEBE9]">
      {/* Header with Progress Steps */}
      <div className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Mobile Header */}
          <div className="block lg:hidden py-4">
            <div className="text-center mb-3">
              <h1 className="text-lg font-semibold text-gray-800">
                {mode === 'qr' ? 'Table Order' : 'Checkout'}
              </h1>
              <p className="text-sm text-gray-600">
                Step {isConfirmed ? '3' : '2'} of 3
              </p>
            </div>
           
            {/* Mobile Progress Bar */}
            <div className="flex items-center justify-center space-x-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  {index > 0 && (
                    <div className="h-0.5 w-8 bg-gray-300 mx-1" />
                  )}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium
                      ${step.status === 'complete'
                        ? 'bg-green-500 text-white'
                        : step.status === 'current'
                        ? 'border-2 border-gray-600 text-gray-600 bg-white'
                        : 'border-2 border-gray-300 text-gray-400 bg-white'
                      }`}
                    >
                      {step.status === 'complete' ? '✓' : step.id}
                    </div>
                    <span className="text-xs mt-1 text-center max-w-[60px] leading-tight">
                      {step.name.split(' ').map((word, i) => (
                        <div key={i}>{word}</div>
                      ))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-center py-6">
            <div className="text-center mb-4">
              <h1 className="text-xl font-semibold text-gray-800 mb-2 pr-20">
                {mode === 'qr' ? 'Table Order Checkout' : 'Order Checkout'}
              </h1>
            </div>
           
            <nav className="flex items-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  {index > 0 && (
                    <div
                      className={`h-px w-16 mx-4 ${
                        step.status === 'upcoming' ? 'bg-gray-300' : 'bg-green-500'
                      }`}
                    />
                  )}
                  <div className="flex items-center">
                    <span
                      className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 font-medium
                      ${step.status === 'complete'
                        ? 'bg-green-500 text-white'
                        : step.status === 'current'
                        ? 'border-2 border-gray-400 text-gray-600'
                        : 'border-2 border-gray-300 text-gray-400'
                      }`}
                    >
                      {step.status === 'complete' ? '✓' : step.id}
                    </span>
                    <span
                      className={`whitespace-nowrap ${
                        step.status === 'complete'
                          ? 'text-green-500 font-medium'
                          : step.status === 'current'
                          ? 'text-gray-600 font-medium'
                          : 'text-gray-400'
                      }`}
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
      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-8 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary - Wider Column */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#3E2723] mb-6 pb-2 border-b border-[#D7CCC8]">
              Order Summary
            </h2>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}-${item.milk}-${item.drink}`} 
                  className="flex items-start py-4 border-b border-[#E8D5B5] last:border-0">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#D7CCC8] mr-4">
                    <Image
                      src={item.image || '/images/cup.png'}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 64px, 64px"
                      priority
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#3E2723]">{item.title}</h3>
                    <div className="mt-1 text-sm text-[#8D6E63] space-y-1">
                      {item.size && <p><span className="font-medium">Size:</span> {item.size}</p>}
                      {item.milk && <p><span className="font-medium">Milk:</span> {item.milk}</p>}
                      {item.drink && <p><span className="font-medium">Drink:</span> {item.drink}</p>}
                      {item.toppings && item.toppings.length > 0 && (
                        <p><span className="font-medium">Toppings:</span> {item.toppings.join(', ')}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end ml-4">
                    <p className="font-medium text-[#3E2723]">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-[#8D6E63]">{item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[#D7CCC8]">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#5D4037]">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5D4037]">Tax (10%):</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 mt-3 border-t border-[#D7CCC8]">
                  <span className="text-lg font-bold text-[#3E2723]">Total:</span>
                  <span className="text-lg font-bold text-[#3E2723]">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info and Actions - Narrower Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-[#3E2723] mb-4 pb-2 border-b border-[#D7CCC8]">
                Customer Information
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#8D6E63]">Delivery Method</p>
                  <p className="font-medium text-[#3E2723] capitalize">
                    {customerInfo.deliveryMethod}
                    {customerInfo.deliveryMethod === 'pickup' && mode === 'qr' && customerInfo.tableNumber && (
                      <span className="text-base text-[#5D4037] ml-2">
                        • Table {customerInfo.tableNumber}
                      </span>
                    )}
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#8D6E63]">Email</p>
                    <p className="font-medium text-[#3E2723] break-all">{customerInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8D6E63]">Phone</p>
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
                  <p className="font-medium text-[#3E2723]">Cash on Delivery</p>
                </div>
              </div>
            </div>

            {isConfirmed ? (
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-green-800">Order Confirmed!</h3>
                    <p className="mt-2 text-green-700">
                      {customerInfo.deliveryMethod === 'pickup'
                        ? `Your order will be ready at Table ${customerInfo.tableNumber}.`
                        : 'Your order is on its way!'}
                    </p>
                    <p className="mt-3 text-green-700">
                      A confirmation has been sent to {customerInfo.email}.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/')}
                  className="mt-6 w-full bg-[#5D4037] text-white py-3 rounded-lg hover:bg-[#4E342E] transition-colors font-semibold"
                >
                  Back to Home
                </button>
              </div>
            ) : (
              <button
                onClick={handleConfirmOrder}
                disabled={isProcessing}
                className={`w-full bg-[#5D4037] text-white py-4 rounded-lg font-semibold shadow-md ${
                  isProcessing ? 'opacity-75 cursor-not-allowed' : 'hover:bg-[#4E342E] transition-colors'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Order...
                  </span>
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