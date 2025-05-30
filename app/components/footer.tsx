const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-[#F5F0E9] to-[#E8D5B5] text-[#3E2723] pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12">
                    {/* Company Info */}
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <span className="text-3xl mr-2">☕</span>
                            <h3 className="text-2xl font-bold font-playfair">
                                latteCoffee
                            </h3>
                        </div>
                        <p className="text-[#5D4037] leading-relaxed">
                            Experience premium coffee and tea brewed with passion since 2025.
                        </p>                    <div className="flex space-x-5">
                            {[
                                {
                                    icon: 'M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z',
                                    url: 'https://www.facebook.com/DungGiaIT',
                                    label: 'Follow us on Facebook'
                                },
                                {
                                    icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
                                    url: 'https://www.instagram.com/dunggiait/',
                                    label: 'Follow us on Instagram'
                                }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="h-10 w-10 rounded-full bg-[#D7CCC8] flex items-center justify-center hover:bg-[#c7b3ad] transition-all duration-300 hover:scale-110"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5D4037]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d={social.icon} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Menu Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 pb-2 border-b border-[#A1887F] inline-block">Menu</h4>
                        <ul className="space-y-3">
                            {['Coffee', 'Milk Tea', 'Matchalatte', 'Fruit Tea', 'Seasonal specialties'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="flex items-center text-[#5D4037] hover:text-[#3E2723] transition group">
                                        <span className="w-2 h-2 bg-[#5D4037] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Locations */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 pb-2 border-b border-[#A1887F] inline-block">Branchs</h4>
                        <ul className="space-y-3">
                            {['District 1', 'District 3', 'District 7'].map((location) => (
                                <li key={location}>
                                    <a href="#" className="flex items-center text-[#5D4037] hover:text-[#3E2723] transition group">
                                        <span className="w-2 h-2 bg-[#5D4037] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                                        {location}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 pb-2 border-b border-[#A1887F] inline-block">Receive notifications</h4>
                        <p className="text-[#5D4037] mb-6">
                            Sign up to receive the latest information on drinks, promotions and special events.
                        </p>
                        <div className="flex flex-col space-y-4">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="w-full px-5 py-3 rounded-lg bg-white border border-[#D7CCC8] focus:border-[#5D4037] focus:ring-2 focus:ring-[#5D4037]/30 text-[#3E2723] placeholder-[#A1887F] transition-all"
                                />
                                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#5D4037] text-white px-4 py-1.5 rounded-md font-medium hover:bg-[#4E342E] transition">
                                    Sign Up
                                </button>
                            </div>
                            <p className="text-xs text-[#8D6E63]">
                                We respect your privacy. You can unsubscribe at any time.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-[#A1887F] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-[#8D6E63] mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} latteCoffee.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-[#8D6E63] hover:text-[#5D4037] transition">Privacy policy</a>
                        <a href="#" className="text-[#8D6E63] hover:text-[#5D4037] transition">Terms of service</a>
                        <a href="#" className="text-[#8D6E63] hover:text-[#5D4037] transition">Contact us</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;