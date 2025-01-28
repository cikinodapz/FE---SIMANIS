import { ArrowUp } from "lucide-react";
import useScrollToTop from "../hooks/useScrollTop";

const ScrollButton = () => {
  const { scrollToTop } = useScrollToTop();

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-10 right-6 z-50 p-3 bg-oren text-white rounded-full hover:bg-white hover:text-oren hover:border-oren hover:border-2 transition-colors"
    >
      <ArrowUp size={25} className="w-8 h-8" />
    </button>
  );
};

export default ScrollButton;