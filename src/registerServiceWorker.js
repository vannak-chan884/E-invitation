if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);

        // Listen for updates to the service worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('New Service Worker found:', newWorker);

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Notify user about the update
              if (confirm('A new version is available. Do you want to refresh?')) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
