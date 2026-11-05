// Simple Express.js server for static site
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use((req, res, next) => {
  let pathname;
  try {
    pathname = decodeURIComponent(req.path || '');
  } catch {
    res.sendStatus(400);
    return;
  }
  const blockedPath = /(^|\/)(supabase|node_modules|\.git)(\/|$)/i.test(pathname);
  const blockedFile = /(^|\/)(package(-lock)?\.json|.*\.sql)$/i.test(pathname);
  if (blockedPath || blockedFile || pathname.split('/').includes('.env')) {
    res.sendStatus(404);
    return;
  }
  next();
});

app.use(express.static(path.join(__dirname), {
  dotfiles: 'deny',
  index: false,
}));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
