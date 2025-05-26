export default function ProductPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Enhanced Breadcrumb */}
      <div className="container mx-auto px-4 py-8">
        <nav className="flex items-center space-x-3 text-lg text-gray-600">
          <a href="#" className="hover:text-green-600 transition-colors font-medium">Home</a>
          <span className="text-gray-300">›</span>
          <a href="#" className="hover:text-green-600 transition-colors font-medium">Products</a>
          <span className="text-gray-300">›</span>
          <span className="text-green-600 font-semibold">Midnight Matchalotte</span>
        </nav>
      </div>

      {/* Product Section */}
      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Product Image Placeholder */}
          <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-3xl p-8 aspect-square shadow-lg">
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl h-full flex items-center justify-center">
              <span className="text-2xl text-gray-600">Product Image</span>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            {/* Product Title */}
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent">
              <span className="block leading-tight">Midnight</span>
              <span className="block leading-tight">Matchalotte</span>
            </h1>

            {/* Price */}
            <div className="mb-8">
              <span className="text-3xl font-bold text-gray-800">$5.99</span>
              <span className="text-gray-500 ml-2">/ serving</span>
            </div> 

            {/* Combined Sections */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {/* Size Options */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Size</h2>
                <div className="flex space-x-4">
                  {['S', 'M', 'L'].map((size) => (
                    <button
                      key={size}
                      className="w-16 h-16 flex items-center justify-center border-2 border-gray-200 rounded-xl 
                               hover:border-green-500 hover:scale-105 transition-all duration-300
                               text-xl font-semibold text-gray-700 bg-white shadow-sm
                               focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100">
            <h3 className="text-2xl font-bold text-stone-900 mb-6">ADD TOPPINGS</h3>
            
            <div className="space-y-8">
              {/* Size Selection */}
              {/* <div>
                <h4 className="text-sm font-semibold text-stone-500 mb-4">SELECT SIZE</h4>
                <div className="grid grid-cols-2 gap-3">
                  {['S (12oz)', 'M (16oz)', 'L (20oz)', 'XL (24oz)'].map((size) => (
                    <button
                      key={size}
                      className={`p-4 text-center rounded-xl border-2 transition-all ${
                        size.includes('M') 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-semibold shadow-md' 
                        : 'border-stone-200 hover:border-emerald-400 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Toppings Selection */}
              <div>
                {/* <h4 className="text-sm font-semibold text-stone-500 mb-4">ADD TOPPINGS (+$0.75)</h4> */}
                <div className="grid grid-cols-1 gap-3">
                  {['Whipped Cream', 'Caramel Drizzle', 'Vanilla Foam', 'Chocolate Shavings'].map((topping) => (
                    <label 
                      key={topping}
                      className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:border-emerald-400 transition-colors cursor-pointer"
                    >
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500" 
                      />
                      <span className="text-stone-700">{topping}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
            </div>

            {/* Add to Cart */}
            <button className="w-full bg-gradient-to-r from-green-600 to-cyan-600 text-white py-5 px-8 rounded-xl
                          text-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Add to Cart
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}