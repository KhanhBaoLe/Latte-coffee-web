'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type OrderDetails = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  deliveryMethod?: string; // Optional for QR orders
  tableNumber?: string;
  timestamp: string;
  mode?: 'qr' | 'web'; // Add mode field
};

export default function OrderConfirmation() {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedOrder = sessionStorage.getItem('orderConfirmation');
    if (storedOrder) {
      setOrderDetails(JSON.parse(storedOrder));
    } else {
      // If no order details, redirect to home
      router.push('/');
    }
    setLoading(false);
  }, [router]);  const formatOrderTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleContinueShopping = () => {
    if (orderDetails?.mode === 'qr' && orderDetails?.tableNumber) {
      // For QR mode, go back to the specific table
      router.push(`/table/${orderDetails.tableNumber}`);
    } else {
      // For web mode or when no table number, go to home
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F0E9] via-[#EFEBE9] to-[#E8D5B5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D4037]"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F0E9] via-[#EFEBE9] to-[#E8D5B5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#5D4037] mb-4">Order details not found</p>
          <Link href="/" className="bg-[#5D4037] text-white px-6 py-3 rounded-lg">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E9] via-[#EFEBE9] to-[#E8D5B5] py-8 px-4 sm:px-6 lg:px-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#D7CCC8] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-[#BCAAA4] rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-[#A1887F] rounded-full opacity-25 animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-[#8D6E63] rounded-full opacity-15 animate-bounce delay-500"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Success Animation Container */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            {/* Success Circle with Animation */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4CAF50] to-[#45A049] rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <svg 
                  className="w-12 h-12 sm:w-16 sm:h-16 text-[#4CAF50] animate-bounce" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={3} 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            
            {/* Confetti Elements */}
            <div className="absolute -top-4 -left-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -top-2 -right-6 w-2 h-2 bg-pink-400 rounded-full animate-ping delay-200"></div>
            <div className="absolute -bottom-2 -left-6 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-500"></div>
            <div className="absolute -bottom-4 -right-4 w-3 h-3 bg-green-400 rounded-full animate-ping delay-700"></div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3E2723] mb-4 animate-fade-in">
            ORDER CONFIRMED!
          </h1>
          
          <div className="w-24 h-1 bg-gradient-to-r from-[#5D4037] to-[#8D6E63] mx-auto rounded-full mb-6"></div>
          
          <p className="text-[#5D4037] text-lg sm:text-xl mb-2">
            Thank you, <span className="font-semibold text-[#3E2723]">{orderDetails.customerName}</span>!
          </p>
          <p className="text-[#8D6E63] text-base sm:text-lg">
            Your order has been received and is being prepared with love ☕
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 border border-[#D7CCC8]/50">
          {/* Order ID Section */}
          <div className="text-center mb-8 pb-6 border-b-2 border-dashed border-[#D7CCC8]">
            <p className="text-[#8D6E63] text-sm uppercase tracking-wide mb-2">Order Number</p>
            <div className="bg-gradient-to-r from-[#F5F0E9] to-[#E8D5B5] rounded-xl p-4 w-full inline-block sm:w-auto">
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#3E2723] font-mono tracking-wider break-all">
                #{orderDetails.orderId}
              </p>
            </div>
          </div>          {/* Order Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              {/* Delivery Method - Only show for Web mode */}
              {orderDetails.mode === 'web' && orderDetails.deliveryMethod && (
                <div className="bg-[#F5F0E9] rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-[#5D4037] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                    </svg>
                    <p className="text-[#8D6E63] text-sm font-medium">DELIVERY METHOD</p>
                  </div>
                  <p className="text-[#3E2723] font-semibold capitalize text-lg">
                    {orderDetails.deliveryMethod}
                  </p>
                </div>
              )}

              {/* Table Number - Show for QR mode or when tableNumber exists */}
              {(orderDetails.mode === 'qr' || orderDetails.tableNumber) && (
                <div className="bg-[#F5F0E9] rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-[#5D4037] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                    </svg>
                    <p className="text-[#8D6E63] text-sm font-medium">TABLE NUMBER</p>
                  </div>
                  <p className="text-[#3E2723] font-semibold text-lg">
                    Table {orderDetails.tableNumber}
                  </p>
                </div>
              )}
              
              <div className="bg-[#F5F0E9] rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-[#5D4037] mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                  <p className="text-[#8D6E63] text-sm font-medium">ORDER TIME</p>
                </div>
                <p className="text-[#3E2723] font-semibold">
                  {formatOrderTime(orderDetails.timestamp)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#5D4037] to-[#4E342E] rounded-xl p-4 text-white">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                  </svg>
                  <p className="text-white/80 text-sm font-medium">TOTAL AMOUNT</p>
                </div>
                <p className="text-3xl font-bold">${orderDetails.total.toFixed(2)}</p>
                <p className="text-white/60 text-sm mt-1">Cash on Delivery</p>
              </div>
              
              <div className="bg-[#F5F0E9] rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-[#5D4037] mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <p className="text-[#8D6E63] text-sm font-medium">CONFIRMATION EMAIL</p>
                </div>
                <p className="text-[#3E2723] font-semibold break-all">
                  {orderDetails.customerEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="mb-8">
            <h3 className="text-[#3E2723] font-semibold text-lg mb-4 text-center">Order Status</h3>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-xs text-[#4CAF50] font-medium text-center">Confirmed</span>
              </div>
              
              <div className="flex-1 h-1 bg-gradient-to-r from-[#4CAF50] to-[#FFC107] mx-4 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4CAF50] to-[#FFC107] animate-pulse"></div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-[#FFC107] rounded-full flex items-center justify-center mb-2 animate-pulse">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </div>
                <span className="text-xs text-[#FFC107] font-medium text-center">Preparing</span>
              </div>
              
              <div className="flex-1 h-1 bg-[#E0E0E0] mx-4 rounded-full"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-[#E0E0E0] rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>                <span className="text-xs text-gray-400 font-medium text-center">
                  {(orderDetails.mode === 'qr' || orderDetails.deliveryMethod === 'pickup') ? 'Ready' : 'Delivered'}
                </span>
              </div>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="bg-gradient-to-r from-[#E8F5E8] to-[#F0F8F0] rounded-xl p-4 text-center mb-6 border border-[#4CAF50]/20">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-[#4CAF50] mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              <span className="text-[#4CAF50] font-semibold">Estimated Time</span>
            </div>            <p className="text-[#2E7D32] text-lg font-bold">
              {(orderDetails.mode === 'qr' || orderDetails.deliveryMethod === 'pickup') ? '15-20 minutes' : '25-35 minutes'}
            </p>
          </div>
        </div>        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleContinueShopping}
            className="w-full bg-gradient-to-r from-[#5D4037] to-[#4E342E] hover:from-[#4E342E] hover:to-[#3E2723] text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
            {orderDetails?.mode === 'qr' ? 'BACK TO TABLE' : 'CONTINUE SHOPPING'}
          </button>
          
          <button
            onClick={() => window.print()}
            className="w-full bg-white hover:bg-[#F5F0E9] text-[#5D4037] font-semibold py-4 px-8 rounded-2xl transition-all duration-300 border-2 border-[#5D4037] hover:border-[#4E342E] flex items-center justify-center group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd"/>
            </svg>
            PRINT RECEIPT
          </button>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8 pt-6 border-t border-[#D7CCC8]/50">
          <p className="text-[#8D6E63] text-sm mb-2">
            We will send you updates about your order via email and SMS
          </p>
          <p className="text-[#A1887F] text-xs">
            Thank you for choosing our coffee shop! ☕ Have a wonderful day!
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}