import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import type { Page, RouterState } from './types';

// PWA setup — injected at runtime so Bun's HTML bundler doesn't try to resolve these paths
if (typeof document !== 'undefined') {
  const manifest = document.createElement('link');
  manifest.rel = 'manifest';
  manifest.href = './manifest.webmanifest';
  document.head.appendChild(manifest);

  const ati = document.createElement('link');
  ati.rel = 'apple-touch-icon';
  ati.href = './icon.svg';
  document.head.appendChild(ati);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Batches from './pages/Batches';
import BatchDetail from './pages/BatchDetail';
import Nutrients from './pages/Nutrients';
import Schedule from './pages/Schedule';
import Reference from './pages/Reference';
import Settings from './pages/Settings';

function parseHash(): RouterState {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash.startsWith('batch/')) {
    return { page: 'batch-detail', batchId: hash.replace('batch/', '') };
  }
  const map: Record<string, Page> = {
    '': 'dashboard',
    'batches': 'batches',
    'nutrients': 'nutrients',
    'schedule': 'schedule',
    'reference': 'reference',
    'settings': 'settings',
  };
  return { page: map[hash] ?? 'dashboard' };
}

function navigate(r: RouterState) {
  if (r.page === 'batch-detail') {
    window.location.hash = `/batch/${r.batchId}`;
  } else if (r.page === 'dashboard') {
    window.location.hash = '/';
  } else {
    window.location.hash = `/${r.page}`;
  }
}

function App() {
  const [route, setRoute] = useState<RouterState>(parseHash);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function renderPage() {
    switch (route.page) {
      case 'dashboard':
        return <Dashboard navigate={navigate} />;
      case 'batches':
        return <Batches navigate={navigate} />;
      case 'batch-detail':
        return <BatchDetail batchId={route.batchId ?? ''} navigate={navigate} />;
      case 'nutrients':
        return <Nutrients />;
      case 'schedule':
        return <Schedule navigate={navigate} />;
      case 'reference':
        return <Reference />;
      case 'settings':
        return <Settings />;
    }
  }

  return (
    <Layout currentPage={route.page} navigate={navigate}>
      {renderPage()}
    </Layout>
  );
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
