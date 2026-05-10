import React, { useRef, useState } from 'react';
import { useStore } from '../store';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Settings() {
  const { settings, updateSettings, exportData, importData, resetAll } = useStore();
  const [confirmReset, setConfirmReset] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ponicpad-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const ok = importData(text);
      setImportStatus(ok ? 'success' : 'error');
      setTimeout(() => setImportStatus('idle'), 3000);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold text-gray-900">Settings</h1>

      <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-gray-700">Profile</h2>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Your name</label>
          <input
            type="text"
            value={settings.userName ?? ''}
            onChange={e => updateSettings({ userName: e.target.value || undefined })}
            placeholder="e.g. Armanda"
            className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Tower name</label>
          <input
            type="text"
            value={settings.towerName ?? ''}
            onChange={e => updateSettings({ towerName: e.target.value || undefined })}
            placeholder="e.g. Tower 1"
            className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </section>

      <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-gray-700">Nutrient defaults</h2>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Base water TDS (ppm)</label>
          <input
            type="number"
            min={0}
            max={2000}
            value={settings.baseTDS}
            onChange={e => updateSettings({ baseTDS: Number(e.target.value) })}
            className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400">Your tap water TDS reading. Used as default in the nutrient calculator.</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">AB Mix ratio (ml per liter)</label>
          <input
            type="number"
            min={1}
            max={20}
            step={0.5}
            value={settings.abMixRatioPerLiter}
            onChange={e => updateSettings({ abMixRatioPerLiter: Number(e.target.value) })}
            className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400">Standard is 5 ml/L. Adjust if your AB Mix brand differs.</p>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-gray-700">Data</h2>

        <button
          onClick={handleExport}
          className="w-full py-3 bg-green-50 text-green-700 rounded-xl font-medium text-sm hover:bg-green-100 transition-colors border border-green-200"
        >
          Export data (JSON)
        </button>

        <div className="flex flex-col gap-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 bg-blue-50 text-blue-700 rounded-xl font-medium text-sm hover:bg-blue-100 transition-colors border border-blue-200"
          >
            Import data (JSON)
          </button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          {importStatus === 'success' && (
            <p className="text-sm text-green-600 text-center">Data imported successfully!</p>
          )}
          {importStatus === 'error' && (
            <p className="text-sm text-red-500 text-center">Import failed — invalid file format.</p>
          )}
        </div>

        <button
          onClick={() => setConfirmReset(true)}
          className="w-full py-3 text-red-500 rounded-xl font-medium text-sm hover:bg-red-50 transition-colors"
        >
          Reset all data
        </button>
      </section>

      <ConfirmDialog
        isOpen={confirmReset}
        title="Reset all data?"
        message="This will permanently delete all batches, logs, and settings. This cannot be undone."
        confirmLabel="Reset everything"
        danger
        onConfirm={() => { resetAll(); setConfirmReset(false); }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
