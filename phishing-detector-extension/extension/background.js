// Automatically scan tab whenever user switches tab or opens new URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    autoScanUrl(tab.url);
  }
});

async function autoScanUrl(url) {
  try {
    const response = await fetch('http://127.0.0.1:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url })
    });

    const data = await response.json();

    if (data.is_phishing) {
      // Trigger System Alert Notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        title: '⚠️ CYBERSHIELD ALERT: Phishing Risk!',
        message: `Dangerous URL detected (${data.confidence}% risk):\n${url}`,
        priority: 2
      });
    }
  } catch (err) {
    console.error("Background AI Scan failed. Server offline?");
  }
}