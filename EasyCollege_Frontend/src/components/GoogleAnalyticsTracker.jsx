import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GoogleAnalyticsTracker = () => {
    const location = useLocation();

    useEffect(() => {
        if (typeof window.gtag === 'function') {
            window.gtag('config', 'G-6MDXJ0EXKZ', { // Your Measurement ID
                page_path: location.pathname + location.search,
            });
        }
    }, [location]);

    return null;
};

export default GoogleAnalyticsTracker;