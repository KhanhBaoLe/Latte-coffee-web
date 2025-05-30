// app/confirm/page.tsx
import Link from 'next/link'

export default function OrderConfirmation() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F5F0E9] to-[#E8D5B5] py-12 px-6 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-[#D7CCC8]">
                <div className="text-[#4CAF50] text-6xl mb-6">✓</div>

                <h1 className="text-[#3E2723] text-3xl font-bold mb-6">
                    ORDER SUCCESSFUL!
                </h1>

                <div className="space-y-4 mb-8">
                    <p className="text-[#5D4037]">
                        Thank you for placing your order. Your order has been received and is being processed.
                    </p>

                    {/* <div className="bg-[#F5F0E9] rounded-xl py-3 px-4 inline-block">
                        <p className="text-[#5D4037]">
                            Mã đơn hàng: 
                            <span className="text-[#3E2723] font-bold ml-2">
                                #DH123456
                            </span>
                        </p>
                    </div> */}
                </div>

                <div className="border-t border-[#D7CCC8] pt-6">
                    <Link
                        href="/"
                        className="bg-[#5D4037] hover:bg-[#4E342E] text-white font-bold py-3 px-6 rounded-lg inline-block transition-colors duration-300"
                    >
                        CONTINUE SHOPPING
                    </Link>
                </div>
            </div>
        </div>
    )
}