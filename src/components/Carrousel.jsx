import React from "react";
import useCarousel from "../hooks/useCarrousel";

const Carousel = ({ images = [] }) => {
  const { currentIndex, handleNext, handlePrev } = useCarousel(images.length);

  return (
    <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
      <div className="relative overflow-hidden w-full h-full bg-white rounded-lg shadow-md">
        {/* Slides Container */}
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.length > 0 ? (
            images.map((image, index) => (
              <div 
                key={index} 
                className="w-full flex-shrink-0 h-full"
              >
                <div className="relative flex justify-center items-center w-full h-full bg-gray-100">
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover object-center rounded-lg"
                    loading="lazy"
                  />
                  {/* Optional: Add gradient overlay for better button visibility */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
                </div>
              </div>
            ))
          ) : (
            <div className="w-full flex-shrink-0 h-full">
              <div className="flex justify-center items-center w-full h-full bg-gray-100">
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-800">
                  No images available
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 
                  ${currentIndex === index 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/70'}`}
                onClick={() => {
                  const newIndex = index;
                  const direction = newIndex > currentIndex ? 'next' : 'prev';
                  if (direction === 'next') {
                    handleNext(newIndex);
                  } else {
                    handlePrev(newIndex);
                  }
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 p-1.5 sm:p-2 md:p-3
              bg-white/80 hover:bg-white rounded-full shadow-lg
              transition-transform duration-300 hover:scale-110
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Previous slide"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 p-1.5 sm:p-2 md:p-3
              bg-white/80 hover:bg-white rounded-full shadow-lg
              transition-transform duration-300 hover:scale-110
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Next slide"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;