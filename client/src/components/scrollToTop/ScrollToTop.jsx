import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
    const { pathname, key } = useLocation();

    useEffect(() => {
        const element = document.querySelector(".app-wrapper");
        if (element) {
            // Get the scroll position from history state
            const scrollPosition = window.history.state?.scrollPosition;
            if (scrollPosition) {
                // Restore the scroll position if it exists
                element.scrollTo(0, scrollPosition);
            } else {
                // Scroll to top otherwise
                element.scrollTo(0, 0);
            }
        }
    }, [pathname, key]);

    useEffect(() => {
        const element = document.querySelector(".app-wrapper");
        if (element) {
            // Save the scroll position in history state
            const handleScroll = () => {
                window.history.replaceState(
                    { ...window.history.state, scrollPosition: element.scrollTop },
                    ""
                );
            };
            element.addEventListener("scroll", handleScroll);
            return () => {
                element.removeEventListener("scroll", handleScroll);
            };
        }
    }, []);

    return null;
}

export default ScrollToTop;
