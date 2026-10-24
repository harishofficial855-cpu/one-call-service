const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-14LNS6HBQV';

let analyticsInitialized = false;
let lastPageView = { path: '', at: 0 };

const createEventId = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    return (character === 'x' ? random : (random & 0x3) | 0x8).toString(16);
  });

const initializeAnalytics = () => {
  if (analyticsInitialized || !GA_MEASUREMENT_ID || typeof window === 'undefined') return;
  analyticsInitialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);
};

const sendStoredEvent = (event) => {
  try {
    fetch(`${API_URL.replace(/\/$/, '')}/tracking/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      keepalive: true,
    }).then((response) => {
      if (!response.ok) console.warn(`Tracking event was not stored (HTTP ${response.status}).`);
    }).catch((error) => {
      console.warn('Tracking event could not be stored.', error);
    });
  } catch (error) {
    console.warn('Tracking event could not be sent.', error);
  }
};

const sendGoogleEvent = (eventName, parameters) => {
  try {
    initializeAnalytics();
    if (window.gtag) window.gtag('event', eventName, parameters);
  } catch (error) {
    console.warn('Google Analytics event could not be sent.', error);
  }
};

export const trackPageView = (pagePath) => {
  const pathname = pagePath.split('?')[0].slice(0, 200) || '/';
  const now = Date.now();
  if (lastPageView.path === pathname && now - lastPageView.at < 1000) return;
  lastPageView = { path: pathname, at: now };

  sendGoogleEvent('page_view', {
    page_path: pathname,
    page_title: document.title,
  });
  sendStoredEvent({
    eventId: createEventId(),
    eventType: 'page_view',
    pagePath: pathname,
  });
};

export const trackProviderClick = (providerId, action) => {
  sendGoogleEvent('provider_contact_click', { provider_id: providerId, action });
  sendStoredEvent({
    eventId: createEventId(),
    eventType: 'provider_click',
    providerId,
    action,
    pagePath: window.location.pathname.slice(0, 200) || '/',
  });
};
