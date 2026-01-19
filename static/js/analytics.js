(() => {
  const endpoint = document.body.dataset.statsEndpoint;
  if (!endpoint) return;

  const payload = {
    path: location.pathname,
    ref: document.referrer || null,
    t: Date.now()
  };

  navigator.sendBeacon(endpoint, JSON.stringify(payload));
})();

