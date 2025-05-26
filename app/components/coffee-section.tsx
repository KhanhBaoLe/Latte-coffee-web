
const CoffeeSection = () => {
    type CoffeeItem = {
        title: string;
        cta: string;
    };

    const coffeeItems: CoffeeItem[] = [
        {
            title: "Midnight Mint Mocha Frappuccino",
            cta: "ADD TO BASKET"
        },
        {
            title: "Midnight Mint Mocha Frappuccino",
            cta: "ADD TO BASKET"
        },
        {
            title: "Midnight Mint Mocha Frappuccino",
            cta: "ADD TO BASKET"
        },
        {
            title: "Midnight Mint Mocha Frappuccino",
            cta: "ADD TO BASKET"
        }
    ];

    return (
        <section className="bg-[#f8dcc5] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-left text-orange-600 mb-12">
                    Fruit Juice
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {coffeeItems.map((item, index) => (
                        <div
                            key={index}
                            className="group rounded-2xl shadow-md transition-transform duration-300 transform hover:scale-105 p-6 flex flex-col justify-between bg-[#fd8e3d] text-white"
                        >
                            <div className="flex justify-center mb-4">
                                <img src="/images/cup.png" alt="Coffee Cup" className="h-24" />
                            </div>

                            <h2 className="text-lg font-bold mb-4 leading-snug text-white">
                                {item.title}
                            </h2>

                            <div className="mb-4 space-y-1 text-sm">
                                <p><span className="font-bold">Size</span>: Select a size</p>
                                <p><span className="font-bold">Milk</span>: Select a milk type</p>
                                <p><span className="font-bold">Drink</span>: Drink type</p>
                            </div>

                            <button className="w-full mt-auto bg-white text-black rounded-full py-2 px-4 font-bold tracking-wide">
                                {item.cta}
                            </button>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
};

export default CoffeeSection;