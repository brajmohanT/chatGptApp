"use client";

import { useState, useRef, useEffect } from "react";

interface Product {
    id: number;
    title: string;
    category: string;
    price: number;
    thumbnail: string;
    rating?: number;
    brand?: string;
    description?: string;
}

interface ProductCarouselProps {
    products: Product[];
    total: number;
    query: string;
}

export default function ProductCarousel({ products, total, query }: ProductCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [cardsPerView, setCardsPerView] = useState(1);

    // Calculate cards per view based on screen size
    useEffect(() => {
        const updateCardsPerView = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setCardsPerView(1);
            } else if (width < 1024) {
                setCardsPerView(2);
            } else {
                setCardsPerView(3);
            }
        };

        updateCardsPerView();
        window.addEventListener('resize', updateCardsPerView);
        return () => window.removeEventListener('resize', updateCardsPerView);
    }, []);

    const maxIndex = Math.max(0, products.length - cardsPerView);

    const goToPrevious = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex(prev => Math.max(0, prev - 1));
        setTimeout(() => setIsAnimating(false), 300);
    };

    const goToNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
        setTimeout(() => setIsAnimating(false), 300);
    };

    const goToSlide = (index: number) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex(Math.min(maxIndex, index));
        setTimeout(() => setIsAnimating(false), 300);
    };

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No products found for "{query}"</div>
                <div className="text-gray-400 text-sm mt-2">Try searching with different keywords</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Search Results for "{query}"
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Found {total} products
                </p>
            </div>

            {/* Carousel Container */}
            <div className="relative">
                {/* Navigation Buttons */}
                {products.length > cardsPerView && (
                    <>
                        <button
                            onClick={goToPrevious}
                            disabled={currentIndex === 0}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Previous products"
                        >
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={goToNext}
                            disabled={currentIndex >= maxIndex}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Next products"
                        >
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Carousel Track */}
                <div
                    ref={carouselRef}
                    className="overflow-hidden mx-8"
                >
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
                            width: `${(products.length / cardsPerView) * 100}%`
                        }}
                    >
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} cardsPerView={cardsPerView} />
                        ))}
                    </div>
                </div>

                {/* Dot Indicators */}
                {products.length > cardsPerView && (
                    <div className="flex justify-center mt-6 space-x-2">
                        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex
                                        ? "bg-blue-600"
                                        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ProductCard({ product, cardsPerView }: { product: Product; cardsPerView: number }) {
    const [imageError, setImageError] = useState(false);

    return (
        <div
            className="flex-shrink-0 px-2"
            style={{ width: `${100 / cardsPerView}%` }}
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                    {!imageError ? (
                        <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-gray-400 text-center">
                                <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                <div className="text-sm">No Image</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    {/* Category Badge */}
                    <div className="mb-2">
                        <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full capitalize">
                            {product.category.replace('-', ' ')}
                        </span>
                    </div>

                    {/* Product Title */}
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                        {product.title}
                    </h3>

                    {/* Brand */}
                    {product.brand && (
                        <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                            {product.brand}
                        </p>
                    )}

                    {/* Rating */}
                    {product.rating && (
                        <div className="flex items-center mb-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-3 h-3 ${i < Math.floor(product.rating!)
                                                ? "text-yellow-400"
                                                : "text-gray-300 dark:text-gray-600"
                                            }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                                ({product.rating.toFixed(1)})
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        ${product.price.toFixed(2)}
                    </div>

                    {/* View Details Button */}
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}