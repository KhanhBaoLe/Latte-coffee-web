'use client';

import CoffeeSection from '@/app/components/coffee-section';
import { useCart } from '../../components/CartContext';
import { table as tableList } from '@/app/data/id_table';
import { useParams } from 'next/navigation';

export default function TablePage() {
    const params = useParams();
    const tableId = params.id ? `table${params.id}` : null;
    const foundTable = tableList.find(t => t.id_table === tableId);
    const tableNumber = foundTable ? foundTable.id_table.replace('table', '') : 'Unknown';
    const { cartItems, totalPrice } = useCart();

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F5F0E9] to-[#E8D5B5] py-12 px-6">
            <div className="max-w-7xl mx-auto space-y-16">

                {/* Section: Title & Table ID */}
                <section className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-4">Chào mừng đến bàn của bạn</h1>
                    <p className="text-xl text-[#5D4037]">
                        Bạn đang xem <span className="font-semibold text-[#5D4037]">Bàn số #{tableNumber}</span>
                    </p>
                </section>

                {/* Section: Cart Table */}
                <section className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto border border-[#D7CCC8]">
                    <h2 className="text-3xl font-bold text-[#3E2723] mb-6">Đơn hàng của bạn</h2>
                    <table className="min-w-full text-left text-sm border-collapse">
                        <thead className="bg-[#5D4037] text-white">
                            <tr>
                                <th className="py-3 px-5 rounded-tl-xl">Tên món</th>
                                <th className="py-3 px-5">Size</th>
                                <th className="py-3 px-5">Sữa</th>
                                <th className="py-3 px-5">Loại</th>
                                <th className="py-3 px-5">Số lượng</th>
                                <th className="py-3 px-5 rounded-tr-xl">Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr
                                    key={`${item.id}-${item.size}-${item.milk}-${item.drink}`}
                                    className="odd:bg-white even:bg-[#F5F0E9] border-b last:border-none border-[#E8D5B5] hover:bg-[#E8D5B5]/50 transition"
                                >
                                    <td className="py-3 px-5 font-medium text-[#3E2723]">{item.name}</td>
                                    <td className="py-3 px-5 text-[#5D4037]">{item.size}</td>
                                    <td className="py-3 px-5 text-[#5D4037]">{item.milk}</td>
                                    <td className="py-3 px-5 text-[#5D4037]">{item.drink}</td>
                                    <td className="py-3 px-5 font-bold text-[#5D4037]">{item.quantity}</td>
                                    <td className="py-3 px-5 font-semibold text-[#4E342E]">{(item.price * item.quantity).toLocaleString()}₫</td>
                                </tr>
                            ))}
                            {cartItems.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-[#8D6E63] italic">
                                        Giỏ hàng của bạn đang trống. Hãy chọn món từ menu bên dưới!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        {cartItems.length > 0 && (
                            <tfoot className="border-t-2 border-[#D7CCC8]">
                                <tr>
                                    <td colSpan={5} className="py-4 px-5 font-bold text-right text-[#3E2723]">Tổng cộng:</td>
                                    <td className="py-4 px-5 font-bold text-[#4E342E]">{totalPrice.toLocaleString()}₫</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </section>

                {/* Section: Coffee Products */}
                <section>
                    <h2 className="text-3xl font-bold text-[#3E2723] mb-8 text-center">
                        Thực đơn đồ uống
                    </h2>
                    <CoffeeSection />
                </section>
            </div>
        </div>
    );
}