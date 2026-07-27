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
/* v1.2.15 R2/R3. The backend now sends DATA-ONLY, so this handler is the
 * sole display path and the options below actually take effect.
 * Why that mattered: firebase-messaging-compat 12.16.0's push handler reads
 *     else if (payload.notification) { showNotification(...) }
 *     if (onBackgroundMessageHandler) { handler(payload) }
 * The second is a separate statement, not an else — so a notification
 * payload made the SDK display one itself (title/body only, no
 * requireInteraction, no tag) and STILL called this handler, which
 * displayed a second. Reading payload.data is therefore not a style choice:
 * with data-only there is no payload.notification to read.
 * requireInteraction (R2): the browser's ~4s auto-dismiss is not adjustable
 * — the Notifications API exposes no duration, only this flag. The user
 * asked to be notified.
 * tag (R3): a second alert for the same match REPLACES the first instead of
 * stacking. The constant fallback means a payload without a key can never
 * throw; it only collapses untagged alerts together. */
messaging.onBackgroundMessage((payload) => {
  const d = (payload && payload.data) || {};
  self.registration.showNotification(d.title || "Service Break", {
    body: d.body || "",
    icon: "/dashboard/favicon.ico",
    requireInteraction: true,
    tag: d.tag || "sb-alert",
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
