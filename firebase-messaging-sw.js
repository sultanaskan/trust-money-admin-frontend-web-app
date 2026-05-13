// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDhaJBjG7N-QjH4U0GSCrV5LLCm04aR2us",
  authDomain: "studio-4167150876-dea3d.firebaseapp.com",
  projectId: "studio-4167150876-dea3d",
  storageBucket: "studio-4167150876-dea3d.firebasestorage.app",
  messagingSenderId: "723238955217",
  appId: "1:723238955217:web:7c68ac4c10836679b37df0"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/images/ic_trust_money_logo.png', // Add an icon path here
    badge: '/assets/images/ic_trust_money_logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);


  self.addEventListener('notificationclick', (event) => {
    // 1. Close the notification popup immediately
    event.notification.close();

    // 2. Get the URL from the notification data (passed from the server)
    // If no URL is provided, default to the home page
    let urlToOpen = event.notification.data && event.notification.data.url
      ? event.notification.data.url
      : '/';

    urlToOpen = "http://localhost:5500";

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((windowClients) => {
          // Check if there is already a window/tab open with the target URL
          for (let i = 0; i < windowClients.length; i++) {
            const client = windowClients[i];
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          // If no tab is open, open a new one
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  });



});