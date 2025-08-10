const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('🔄 Downloading Windows Chromium for Puppeteer...');

  // Force download Windows Chromium version Puppeteer expects
  const browserFetcher = puppeteer.createBrowserFetcher({ platform: 'win64' });
  const revision = puppeteer._preferredRevision;
  const revisionInfo = await browserFetcher.download(revision);

  console.log(`✅ Windows Chromium downloaded at: ${revisionInfo.executablePath}`);

  // Save executable path for runtime use
  fs.writeFileSync(
    path.join(__dirname, 'chromium-path.txt'),
    revisionInfo.executablePath,
    'utf-8'
  );
})();
