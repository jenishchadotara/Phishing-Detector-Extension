document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const targetUrl = document.getElementById('targetUrl');
  const scanBtn = document.getElementById('scanBtn');
  const statusText = document.getElementById('statusText');
  const subStatus = document.getElementById('subStatus');
  const statusIcon = document.getElementById('statusIcon');
  const container = document.getElementById('container');

  if (tab && tab.url) {
    targetUrl.innerText = tab.url;
  }

  scanBtn.addEventListener('click', async () => {
    // UI Scanning State Animation
    scanBtn.innerText = "ANALYZING TARGET...";
    statusText.innerText = "SCANNING...";
    subStatus.innerText = "Running Neural Network Checks...";
    statusIcon.innerText = "🔄";
    statusIcon.style.animation = "spin 1s infinite linear";

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: tab.url })
      });

      const data = await response.json();
      statusIcon.style.animation = "none";

      if (data.is_phishing) {
        // Danger Theme
        container.className = "shield-container state-danger";
        statusIcon.innerText = "⚠️";
        statusText.innerText = "THREAT DETECTED";
        subStatus.innerText = `Phishing Probability: ${data.confidence}%`;
      } else {
        // Safe Theme
        container.className = "shield-container state-safe";
        statusIcon.innerText = "🛡️";
        statusText.innerText = "URL IS SAFE";
        subStatus.innerText = `Safety Score: ${100 - data.confidence}% Verified`;
      }
    } catch (error) {
      statusIcon.style.animation = "none";
      container.className = "shield-container state-danger";
      statusIcon.innerText = "❌";
      statusText.innerText = "API OFFLINE";
      subStatus.innerText = "Python FastAPI Backend Server Off Chhe!";
    }

    scanBtn.innerText = "RE-SCAN TARGET";
  });
});