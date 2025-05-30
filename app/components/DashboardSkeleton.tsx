
const DashboardSkeleton = () => {
    return (
        <div className="w-full animate-pulse">
            {/* Header Skeleton */}
            <div className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo Skeleton */}
                        <div className="w-32 h-8 bg-gray-200 rounded-md"></div>

                        {/* Navigation Links Skeleton */}
                        <div className="hidden md:flex space-x-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-20 h-4 bg-gray-200 rounded"></div>
                            ))}
                        </div>

                        {/* Cart Button Skeleton */}
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Hero Section Skeleton */}
            <div className="bg-gradient-to-b from-[#F9F6F1] to-[#F5F0E9]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* Text Content Skeleton */}
                        <div className="space-y-6">
                            <div className="w-3/4 h-10 bg-gray-200 rounded-lg"></div>
                            <div className="w-full h-6 bg-gray-200 rounded"></div>
                            <div className="w-5/6 h-6 bg-gray-200 rounded"></div>
                            <div className="w-40 h-12 bg-gray-200 rounded-lg"></div>
                        </div>

                        {/* Image Skeleton */}
                        <div className="aspect-square w-full bg-gray-200 rounded-2xl"></div>
                    </div>
                </div>
            </div>

            {/* Coffee Section Skeleton */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Title Skeleton */}
                    <div className="text-center mb-12">
                        <div className="w-64 h-10 bg-gray-200 rounded mx-auto mb-4"></div>
                        <div className="w-96 h-6 bg-gray-200 rounded mx-auto"></div>
                    </div>

                    {/* Coffee Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                                {/* Image Skeleton */}
                                <div className="aspect-square w-full bg-gray-200 rounded-xl mb-6"></div>

                                {/* Content Skeleton */}
                                <div className="space-y-4">
                                    <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
                                    <div className="w-full h-4 bg-gray-200 rounded"></div>
                                    <div className="w-1/2 h-8 bg-gray-200 rounded"></div>
                                    <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Skeleton */}
            <div className="bg-[#3E2723] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <div className="w-40 h-6 bg-gray-500 rounded"></div>
                                <div className="space-y-2">
                                    {[...Array(4)].map((_, j) => (
                                        <div key={j} className="w-full h-4 bg-gray-500 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
