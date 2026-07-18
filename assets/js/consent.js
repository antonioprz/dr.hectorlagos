// Cookie consent — gates Meta Pixel and GA4 behind an explicit accept/reject.
(function () {
  const CONSENT_KEY = 'cookie_consent';
  const PIXEL_ID = 'PIXEL_ID_PLACEHOLDER';
  const GA4_ID = 'G-XXXXXXXXXX';

  function loadMetaPixel() {
    if (window.fbq) return;
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }

  function loadGA4() {
    if (window.gtag) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA4_ID);
  }

  const banner = document.getElementById('cookie-banner');

  function showBanner() {
    if (!banner) return;
    banner.classList.remove('translate-y-full');
    banner.classList.add('translate-y-0');
    banner.setAttribute('aria-hidden', 'false');
  }

  function hideBanner() {
    if (!banner) return;
    banner.classList.add('translate-y-full');
    banner.classList.remove('translate-y-0');
    banner.setAttribute('aria-hidden', 'true');
  }

  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      loadMetaPixel();
      loadGA4();
      localStorage.setItem(CONSENT_KEY, 'accepted');
      hideBanner();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'rejected');
      hideBanner();
    });
  }

  const consent = localStorage.getItem(CONSENT_KEY);
  if (consent === 'accepted') {
    loadMetaPixel();
    loadGA4();
  } else if (consent !== 'rejected') {
    showBanner();
  }
})();
