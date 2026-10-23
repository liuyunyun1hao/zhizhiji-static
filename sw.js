
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const data = event.notification.data || {};
    const chatId = data.chatId;
    const appUrl = data.url || './';

    event.waitUntil((async () => {
        const windows = await self.clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        });

        for (const client of windows) {
            if ('focus' in client) {
                await client.focus();
                if (chatId) client.postMessage({ type: 'OPEN_CHAT', chatId });
                return;
            }
        }

        if (self.clients.openWindow) {
            const client = await self.clients.openWindow(appUrl);
            if (client && chatId) client.postMessage({ type: 'OPEN_CHAT', chatId });
        }
    })());
});
