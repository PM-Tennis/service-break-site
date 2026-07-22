/* SP3 W3.3: FCM background service worker — the WEB receiving half.
 * Registered by the app at /dashboard/ scope. Web config is
 * public-by-design (same class as app.json extra). W3.4: notification
 * click opens/focuses the board. */
importScripts("https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js");
firebase.initializeApp({
  apiKey: "AIzaSyCeqt3Elalg1UcmzAGG-dhkDVFZoNA0uY4",
  projectId: "service-break",
  appId: "1:132961882769:web:7dae662e19b57bb58ba530",
  messagingSenderId: "132961882769",
});
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const n = (payload && payload.notification) || {};
  self.registration.showNotification(n.title || "Service Break", {
    body: n.body || "",
    icon: "/dashboard/favicon.ico",
  });
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.includes("/dashboard") && "focus" in c) return c.focus();
      }
      return clients.openWindow("/dashboard/");
    }),
  );
});
