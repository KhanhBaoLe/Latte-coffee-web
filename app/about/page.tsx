import Image from 'next/image';
import Link from 'next/link'; // Import Link for social icons

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FDF7E4] via-[#FBF0D9] to-[#F9F6F1]">
            {/* Hero Section */}
            <div className="relative pt-20 pb-16 md:pt-32 md:pb-24 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8D6E63]/10 to-[#A1887F]/5 opacity-50"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-[#5C3D2E] to-[#795548] bg-clip-text text-transparent">
                            About Latte Coffee
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-[#6D4C41] max-w-2xl mx-auto">
                        Crafting moments, one cup at a time. Discover our passion for coffee and community.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 md:py-16">
                {/* Our Story Section */}
                <section className="mb-20 md:mb-28">
                    <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                        <div className="relative group order-2 md:order-1 transform transition-all duration-500 hover:scale-105">
                            <div className="aspect-square rounded-xl overflow-hidden shadow-2xl ">
                                <Image
                                    src="/images/cup.png" // Assuming this is a relevant image for the story
                                    alt="Latte Coffee Ambiance"
                                    layout="fill"
                                    objectFit="cover"
                                    className="group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#E8D5B5]/50 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                            <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#A1887F]/30 rounded-lg transform rotate-12 blur-xl group-hover:rotate-6 transition-transform duration-700"></div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl md:text-4xl font-semibold text-[#5C3D2E] mb-6">
                                Our Story
                            </h2>
                            <p className="text-[#6D4C41] text-base md:text-lg mb-6 leading-relaxed">
                                Founded in 2025, Latte Coffee was born from a simple dream: to share the finest quality coffee and create a warm, inviting space where people connect. Our passion extends beyond the cup – we aim to brew experiences that enrich daily lives.
                            </p>
                            <p className="text-[#6D4C41] text-base md:text-lg leading-relaxed">
                                Each beverage is a testament to our dedication, crafted with premium beans sourced ethically from sustainable farms worldwide. We take pride in a diverse menu that honors traditional espresso while embracing innovative specialty drinks, ensuring there&apos;s a perfect cup for every coffee lover.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Our Values Section */}
                <section className="mb-20 md:mb-28 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#5C3D2E] mb-4">Our Core Values</h2>
                    <p className="text-lg text-[#795548] max-w-xl mx-auto mb-12">
                        The principles that guide every brew and interaction.
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Quality First', description: 'Sourcing only the highest-grade beans and ingredients to ensure every drink meets our premium standards and delights your senses.', icon: '💎' },
                            { title: 'Community Focus', description: "More than a coffee shop – we're a vibrant gathering place for our community to connect, share, and create lasting memories.", icon: '👥' },
                            { title: 'Passionate Innovation', description: 'Continuously exploring new flavors, brewing techniques, and sustainable practices to bring you unique and exciting coffee experiences.', icon: '💡' },
                        ].map((value, index) => (
                            <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center">
                                <div className="text-4xl mb-5 p-4 bg-gradient-to-br from-[#E8D5B5] to-[#FDF7E4] rounded-full shadow-inner">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-[#5C3D2E] mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-[#6D4C41] text-sm leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Founders Section */}
                <section className="bg-white rounded-2xl p-8 sm:p-12 md:p-16 shadow-xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#5C3D2E] text-center mb-12 md:mb-16">
                        Meet Our Founders
                    </h2>

                    {/* Founder 1 */}
                    <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center mb-16 md:mb-20">
                        <div className="md:col-span-2 relative mx-auto md:mx-0">
                            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 group">
                                <Image
                                    src="/founder-images/myprofile.jpg"
                                    alt="Nguyễn Tiến Dũng"
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-full shadow-2xl border-4 border-white transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#5C3D2E]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        </div>
                        <div className="md:col-span-3 text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl font-bold text-[#5C3D2E] mb-2">Nguyễn Tiến Dũng</h3>
                            <p className="text-md font-semibold text-[#86644B] mb-5">CEO & Co-founder</p>
                            <p className="text-[#6D4C41] mb-6 leading-relaxed text-sm md:text-base">
                                With a profound passion for coffee ignited during his university years, Nguyễn Tiến Dũng drives the strategic vision and dynamic growth of Latte Coffee. His innovative flair in coffee brewing and business development has been pivotal in carving out our distinctive niche in the market.
                            </p>
                            <div className="flex justify-center md:justify-start space-x-5">
                                <Link href="https://www.facebook.com/DungGiaIT" target="_blank" rel="noopener noreferrer" className="text-[#5C3D2E]/80 hover:text-[#5C3D2E] transition-colors transform hover:scale-110">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                                </Link>
                                <Link href="https://www.instagram.com/dunggiait/" target="_blank" rel="noopener noreferrer" className="text-[#5C3D2E]/80 hover:text-[#5C3D2E] transition-colors transform hover:scale-110">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                </Link>
                            </div>
                        </div>
                    </div>

                     {/* Founder 2 */}
                     <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center">
                        <div className="md:col-span-3 text-center md:text-left order-2 md:order-1">
                            <h3 className="text-2xl md:text-3xl font-bold text-[#5C3D2E] mb-2">Lê Bảo Khanh</h3>
                            <p className="text-md font-semibold text-[#86644B] mb-5">COO & Co-founder</p>
                            <p className="text-[#6D4C41] mb-6 leading-relaxed text-sm md:text-base">
                                Leveraging extensive expertise in hospitality management, Bảo Khanh spearheads our operations and customer experience endeavors. His unwavering commitment to crafting the ideal fusion of service and ambiance has been pivotal in shaping our distinctive café culture.
                            </p>
                            <div className="flex justify-center md:justify-start space-x-5">
                                <Link href="https://www.facebook.com/khanh.le.51222" target="_blank" rel="noopener noreferrer" className="text-[#5C3D2E]/80 hover:text-[#5C3D2E] transition-colors transform hover:scale-110">
                                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                                </Link>
                                <Link href="https://www.instagram.com/baokahnh/" target="_blank" rel="noopener noreferrer" className="text-[#5C3D2E]/80 hover:text-[#5C3D2E] transition-colors transform hover:scale-110">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                </Link>
                            </div>
                        </div>
                        <div className="md:col-span-2 relative mx-auto md:mx-0 order-1 md:order-2">
                            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 group">
                                <Image
                                    src="/founder-images/Khanh.jpg"
                                    alt="Lê Bảo Khanh"
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-full shadow-2xl border-4 border-white transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tl from-[#5C3D2E]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}