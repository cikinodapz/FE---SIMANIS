import { useCallback } from "react";

const useScrollTop = () => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return { scrollToTop };
};

export default useScrollTop;