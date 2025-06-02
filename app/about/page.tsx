import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#FDF7E4]">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-center text-[#5C3D2E] mb-12">
                    About Latte Coffee
                </h1>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <Image
                            src="/images/cup.png"
                            alt="Coffee cup"
                            width={400}
                            height={400}
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-[#5C3D2E] mb-4">
                            Our Story
                        </h2>
                        <p className="text-[#8B4513] mb-6">
                            Founded in 2025, Latte Coffee has been serving the finest quality coffee
                            to our beloved customers. Our passion for coffee goes beyond just serving
                            drinks - we create experiences that bring people together.
                        </p>
                        <p className="text-[#8B4513]">
                            Every cup we serve is crafted with care, using premium beans sourced
                            from sustainable farms around the world. We take pride in our diverse
                            menu that caters to all coffee lovers, from traditional espresso drinks
                            to innovative specialty beverages.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-[#5C3D2E] mb-3">
                            Quality First
                        </h3>
                        <p className="text-[#8B4513]">
                            We source only the highest quality coffee beans and ingredients to ensure
                            every drink meets our premium standards.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-[#5C3D2E] mb-3">
                            Community Focus
                        </h3>
                        <p className="text-[#8B4513]">
                            We&apos;re more than just a coffee shop - we&apos;re a gathering place
                            for our community to connect and share moments.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-[#5C3D2E] mb-3">
                            Innovation
                        </h3>
                        <p className="text-[#8B4513]">
                            We continuously explore new flavors and techniques to bring you unique
                            and exciting coffee experiences.
                        </p>
                    </div>
                </div>

                {/* Founders Section */}
                <div className="bg-white rounded-xl p-8 shadow-lg mb-16">
                    <h2 className="text-3xl font-bold text-[#5C3D2E] text-center mb-8">
                        Meet Our Founders
                    </h2>

                    {/* First Founder */}
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <div className="relative">
                            <div className="relative w-48 h-48 mx-auto md:w-64 md:h-64">
                                <Image
                                    src="/founder-images/myprofile.jpg"
                                    alt="Founder"
                                    fill
                                    className="object-cover rounded-full shadow-xl"
                                />
                            </div>
                            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-[#5C3D2E] text-white px-6 py-2 rounded-full shadow-lg">
                                <h3 className="text-lg font-semibold">Nguyễn Tiến Dũng</h3>
                                <p className="text-sm text-gray-200">CEO & Co-founder</p>
                            </div>
                        </div>
                        <div className="text-center md:text-left mt-8 md:mt-0">
                            <p className="text-[#8B4513] mb-6 leading-relaxed">
                                With a passion for coffee that began during his university years, Nguyễn Tiến Dũng oversees the strategic vision and growth of Latte Coffee. His innovative approach to coffee brewing and business development has helped shape our unique identity in the market.
                            </p>
                            <div className="flex justify-center md:justify-start space-x-4 mt-6">
                                <a
                                    href="https://www.facebook.com/DungGiaIT"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#5C3D2E] hover:text-[#8B4513] transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.instagram.com/dunggiait/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#5C3D2E] hover:text-[#8B4513] transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Second Founder */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative order-1 md:order-2">
                            <div className="relative w-48 h-48 mx-auto md:w-64 md:h-64">
                                <Image
                                    src="/founder-images/Khanh.jpg"
                                    alt="Co-founder"
                                    fill
                                    className="object-cover rounded-full shadow-xl"
                                />
                            </div>
                            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-[#5C3D2E] text-white px-6 py-2 rounded-full shadow-lg">
                                <h3 className="text-lg font-semibold">Lê Bảo Khanh</h3>
                                <p className="text-sm text-gray-200">COO & Co-founder</p>
                            </div>
                        </div>
                        <div className="text-center md:text-left mt-8 md:mt-0 order-2 md:order-1">
                            <p className="text-[#8B4513] mb-6 leading-relaxed">
                                With extensive experience in hospitality management, Bảo Khanh leads our operations and customer experience initiatives. His dedication to creating the perfect blend of service and atmosphere has been instrumental in establishing our unique café culture.
                            </p>
                            <div className="flex justify-center md:justify-start space-x-4 mt-6">
                                <a
                                    href="https://www.facebook.com/khanh.le.51222"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#5C3D2E] hover:text-[#8B4513] transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.instagram.com/baokahnh/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#5C3D2E] hover:text-[#8B4513] transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
