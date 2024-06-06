import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTopOnPageChange() {
  // get the current location (route) using the useLocation hook.
  const location = useLocation();

  useEffect(() => {
    // scroll the window to the top (0, 0) of the page.
    window.scrollTo(0, 0);
  }, [location]);

  return null; // return null because this component doesn't render any UI
}

export default ScrollToTopOnPageChange;
