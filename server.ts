import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Lazy Firebase init to prevent startup crash if file missing
  let db: any = null;
  try {
    const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      const firebaseApp = initializeApp(firebaseConfig);
      db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    }
  } catch (error) {
    console.error('Firebase server-side init failed:', error);
  }

  app.use(express.json());

  // SEO Metadata injector for sharing links
  app.get('/listing/:id', async (req, res, next) => {
    const { id } = req.params;
    
    if (!db) return next();

    try {
      const docRef = doc(db, 'listings', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const item = docSnap.data();
        const distPath = path.join(process.cwd(), 'dist');
        const indexPath = process.env.NODE_ENV === 'production' 
          ? path.join(distPath, 'index.html')
          : path.join(process.cwd(), 'index.html');
        
        if (fs.existsSync(indexPath)) {
          let html = fs.readFileSync(indexPath, 'utf-8');
          
          // Inject SEO Meta Tags
          const seoTags = `
            <title>${item.title} - سوق المعلم</title>
            <meta name="description" content="${(item.description || '').substring(0, 160)}">
            <meta property="og:title" content="${item.title}">
            <meta property="og:description" content="${(item.description || '').substring(0, 160)}">
            <meta property="og:type" content="website">
            <meta property="og:url" content="${req.protocol}://${req.get('host')}${req.originalUrl}">
            <meta name="twitter:card" content="summary_large_image">
          `;
          
          // Target the specific title in index.html
          html = html.replace('<title>سوق المعلم - Souq M3alem</title>', seoTags);
          return res.send(html);
        }
      }
    } catch (err) {
      console.error('SEO Injection error:', err);
    }
    next();
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Not Found');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

