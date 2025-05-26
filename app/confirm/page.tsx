// app/confirm/page.tsx
import Link from 'next/link'

export default function OrderConfirmation() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                <div className="text-blue-500 text-6xl mb-4">✓</div>
                <h1 className="text-blue-500 text-3xl font-bold mb-4">ĐẶT HÀNG THÀNH CÔNG!</h1>
                <p className="text-gray-700 mb-4">
                    Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
                </p>
                <p className="text-gray-700 mb-6">
                    Mã đơn hàng của bạn: <span className="text-blue-500 font-bold">#DH123456</span>
                </p>
                <Link
                    href="/"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg inline-block transition-colors"
                >
                    TIẾP TỤC MUA SẮM
                </Link>
            </div>
        </div>
    )
}