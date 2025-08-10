const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '10mb' }));

const chromiumPathFile = path.join(__dirname, './chromium-path.txt'); // adjust relative path if needed
const chromiumPath = fs.existsSync(chromiumPathFile)
  ? fs.readFileSync(chromiumPathFile, 'utf-8').trim()
  : puppeteer.executablePath();

app.post('/convert', async (req, res) => {
  const { html, options } = req.body;
  if (!html) {
    return res.status(400).json({ error: 'Missing HTML content in request body.' });
  }
  let browser;
  try {
     browser = await puppeteer.launch({
          headless: 'new',
          executablePath: chromiumPath,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--single-process', '--disable-dev-shm-usage']
        });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf(options || {});
    res.set({ 'Content-Type': 'application/pdf' });
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.get('/', (req, res) => {
  res.send('HTML to PDF conversion API. POST to /convert with { html: "<html>...</html>" }');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
