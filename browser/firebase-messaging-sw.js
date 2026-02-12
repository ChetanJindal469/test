// src/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAz5RvcfMnGkl238wMSt1WuYGOXFW2SzAY",
  authDomain: "syncinns-7d68d.firebaseapp.com",
  projectId: "syncinns-7d68d",
  storageBucket: "syncinns-7d68d.firebasestorage.app",
  messagingSenderId: "199618996516",
  appId: "1:199618996516:web:4e201fe2b14ebf9c562bb1",
  measurementId: "G-C4FDXCXMV7",
  vapid:
    "BNNR5falHhfFhF7GcyZBoJ2kbYC_E9LEiu9i1hSGR4kzsW4uUG2GByv-AIlRvf56eSuqKdpcbNBuvlDhfvNsWgA",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const chanel = new BroadcastChannel("bg-notification-channel");
  chanel.postMessage(payload);

  // Extract notification data from the payload
  // Check both standard notification object and data object (as in your example)
  const notificationData = payload.data || {};

  console.log("[firebase-messaging-sw.js] notificationData ", notificationData);

  // Use either the notification object or data object for title/body
  const notificationTitle =
    payload.notification?.title ||
    notificationData?.title ||
    "Background Notification";
  const notificationOptions = {
    body:
      payload.notification?.body ||
      notificationData?.body ||
      "You have a new message.",
    icon: payload.notification?.icon || "/favicon.ico",
    // These help make it look more like a native Windows notification
    badge: "/icons/badge-icon.png", // Optional small icon (if you have it)
    data: payload.data || {}, // Store the data for potential click handling
    tag: notificationData.messageId || "default-tag", // Use messageId as tag if available
    requireInteraction: true, // Keep notification visible until user interacts with it
    // Add sound if specified in the payload
    silent: !(notificationData.sound && notificationData.sound !== "default"),
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

// Handle notification click events
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification click received', event);
 
  // Close the notification when clicked
  event.notification.close();
 
  // Get any data passed with the notification
  const notificationData = event.notification.data;
 
  // Default URL to open - you can customize this based on your app's needs
  // For example, if it's a booking notification, you might want to go to the bookings page
  let urlToOpen = '/';
 
  // If the notification is about a booking request, navigate to the bookings page
  if (notificationData && notificationData.title &&
      notificationData.type.toLowerCase().includes('marketplace booking')) {
    urlToOpen = `/syncinns-pms/marketplace-reservation/details?id=${notificationData.id}`; // Adjust this path to match your application's routing
  }
 
  // This will focus an existing window or open a new one if needed
   event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      if (clientList.length > 0) {
        // Send message to the first open client to handle navigation
        clientList[0].postMessage({
          action: 'navigate',
          url: urlToOpen
        });

        return clientList[0].focus();
      }
 
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
