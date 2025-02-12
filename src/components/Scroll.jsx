import { ArrowUp } from "lucide-react";
import useScrollToTop from "../hooks/useScrollTop";

const ScrollButton = () => {
  const { scrollToTop } = useScrollToTop();

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed 
        bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 
        right-4 sm:right-5 md:right-6 
        z-50 
        p-2 sm:p-2.5 md:p-3
        bg-oren 
        text-white 
        rounded-full 
        shadow-lg
        hover:bg-white 
        hover:text-oren 
        hover:border-oren 
        hover:border-2 
        transition-all 
        duration-300
        hover:scale-110
        active:scale-95
        focus:outline-none 
        focus:ring-2 
        focus:ring-oren 
        focus:ring-offset-2"
    >
      <ArrowUp 
        className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" 
        strokeWidth={2.5}
      />
    </button>
  );
};

export default ScrollButton;