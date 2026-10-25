// =============================================================================
// VeritasCraft Pinterest Studio — Text Design & Typography Settings Panel
// =============================================================================

import React, { useState } from 'react';
import { PinTextLayer, TextPresetType, TextTransform } from '../../types';
import {
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Sliders,
  Palette,
  RotateCw,
  Lock,
  Unlock,
  Copy,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  Grid,
  ShieldAlert,
  Move,
  Maximize2,
  Eye,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const FONT_FAMILIES = [
  // Serif
  { id: "'Playfair Display', serif", name: 'Playfair Display', category: 'Serif (Editorial)' },
  { id: "'Fraunces', serif", name: 'Fraunces', category: 'Serif (Vintage)' },
  { id: "'Newsreader', serif", name: 'Newsreader', category: 'Serif (Literary)' },
  { id: "'Cinzel', serif", name: 'Cinzel', category: 'Serif (Luxury Roman)' },
  { id: "Georgia, serif", name: 'Georgia', category: 'Serif (Classic)' },
  // Sans-Serif
  { id: "'Plus Jakarta Sans', sans-serif", name: 'Plus Jakarta Sans', category: 'Sans-Serif (Modern)' },
  { id: "'Inter', sans-serif", name: 'Inter', category: 'Sans-Serif (Precision)' },
  { id: "'Montserrat', sans-serif", name: 'Montserrat', category: 'Sans-Serif (Bold Editorial)' },
  { id: "system-ui, sans-serif", name: 'System Sans', category: 'Sans-Serif (Clean)' },
  // Bold Display
  { id: "'Oswald', sans-serif", name: 'Oswald', category: 'Bold Display (Punch)' },
  { id: "'Syne', sans-serif", name: 'Syne', category: 'Bold Display (Fashion)' },
  { id: "Impact, sans-serif", name: 'Impact', category: 'Bold Display (Heavy)' },
  // Handwritten & Script
  { id: "'Caveat', cursive", name: 'Caveat', category: 'Handwritten (Casual Script)' },
  { id: "'Brush Script MT', cursive", name: 'Brush Script', category: 'Handwritten (Calligraphy)' },
];

export const FONT_SUPPORTED_WEIGHTS: Record<string, string[]> = {
  "'Playfair Display', serif": ['400', '500', '600', '700', '800', '900'],
  "'Fraunces', serif": ['300', '400', '500', '600', '700', '800', '900'],
  "'Newsreader', serif": ['400', '500', '600', '700'],
  "'Cinzel', serif": ['400', '500', '600', '700', '800', '900'],
  "Georgia, serif": ['400', '700'],
  "'Plus Jakarta Sans', sans-serif": ['300', '400', '500', '600', '700', '800'],
  "'Inter', sans-serif": ['300', '400', '500', '600', '700', '800', '900'],
  "'Montserrat', sans-serif": ['300', '400', '500', '600', '700', '800', '900'],
  "system-ui, sans-serif": ['300', '400', '500', '600', '700', '800', '900'],
  "'Oswald', sans-serif": ['400', '500', '600', '700'],
  "'Syne', sans-serif": ['500', '700', '800'],
  "Impact, sans-serif": ['700', '900'],
  "'Caveat', cursive": ['400', '500', '600', '700'],
  "'Brush Script MT', cursive": ['400'],
};

export const WEIGHT_LABELS: Record<string, string> = {
  '300': 'Light (300)',
  '400': 'Normal / Regular (400)',
  '500': 'Medium (500)',
  '600': 'Semibold (600)',
  '700': 'Bold (700)',
  '800': 'Extra Bold (800)',
  '900': 'Black (900)',
};

export const BRAND_COLORS = [
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Dark Slate', hex: '#0F172A' },
  { name: 'Amber Gold', hex: '#FBBF24' },
  { name: 'Royal Blue', hex: '#3157D5' },
  { name: 'Emerald Teal', hex: '#14B8A6' },
  { name: 'Rose Coral', hex: '#FB7185' },
  { name: 'Crimson Wine', hex: '#881337' },
  { name: 'Linen Sand', hex: '#FAF8F4' },
];

interface TextSettingsPanelProps {
  layers: PinTextLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<PinTextLayer>) => void;
  onAddLayer: (preset: TextPresetType) => void;
  onDuplicateLayer: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onMoveLayerZ: (id: string, direction: 'up' | 'down' | 'front' | 'back') => void;
  showSafeMargins: boolean;
  onToggleSafeMargins: () => void;
  showGridGuides: boolean;
  onToggleGridGuides: () => void;
  backgroundColor: string;
}

export const TextSettingsPanel: React.FC<TextSettingsPanelProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onAddLayer,
  onDuplicateLayer,
  onDeleteLayer,
  onMoveLayerZ,
  showSafeMargins,
  onToggleSafeMargins,
  showGridGuides,
  onToggleGridGuides,
  backgroundColor,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'typography' | 'color' | 'effects' | 'position' | 'layers'>('typography');
  const [recentColors, setRecentColors] = useState<string[]>(['#FFFFFF', '#FBBF24', '#0F172A', '#3157D5']);

  const activeLayer = layers.find((l) => l.id === selectedLayerId) || layers[0] || null;

  const handleColorPick = (hex: string) => {
    if (!activeLayer) return;
    onUpdateLayer(activeLayer.id, { color: hex });
    if (!recentColors.includes(hex)) {
      setRecentColors((prev) => [hex, ...prev.slice(0, 7)]);
    }
  };

  // Convert HEX to RGB string for display
  const hexToRgbString = (hex: string) => {
    const clean = hex.replace('#', '');
    if (clean.length !== 6) return 'RGB(255, 255, 255)';
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `RGB(${r}, ${g}, ${b})`;
  };

  // Calculate contrast warning
  const isLowContrast = () => {
    if (!activeLayer) return false;
    const isDarkText = ['#000000', '#0F172A', '#1E232A', '#18181B', '#334155'].includes(activeLayer.color.toUpperCase());
    const isDarkBg = ['#1E3A8A', '#0F172A', '#134E4A', '#881337', '#18181B', '#000000'].includes(backgroundColor.toUpperCase());
    return isDarkText && isDarkBg && !activeLayer.hasBackground;
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Top Text Preset Quick Add Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-slate-900 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>Add Text Element Preset</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">{layers.length} layers on canvas</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'headline', label: '+ Headline' },
            { id: 'subtitle', label: '+ Subtitle' },
            { id: 'description', label: '+ Description' },
            { id: 'cta_button', label: '+ CTA Button' },
            { id: 'price_badge', label: '+ Price Badge' },
            { id: 'website_url', label: '+ URL' },
            { id: 'brand_logo', label: '+ Logo Caption' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => onAddLayer(preset.id as TextPresetType)}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium rounded-lg transition-colors cursor-pointer text-[11px]"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Selector Bar */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-mono uppercase text-slate-500">
          Selected Layer ({activeLayer ? activeLayer.presetType.toUpperCase() : 'None'}):
        </label>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {layers.map((l) => (
            <button
              key={l.id}
              onClick={() => onSelectLayer(l.id)}
              className={`px-3 py-1.5 rounded-lg border text-left shrink-0 transition-all cursor-pointer ${
                selectedLayerId === l.id
                  ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold shadow-xs'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="truncate max-w-[120px] text-[11px] font-mono">
                {l.text || `[Empty ${l.presetType}]`}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Layer Quick Content Editor & Actions */}
      {activeLayer && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900 font-mono text-[11px]">
              Content & Text Box
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onUpdateLayer(activeLayer.id, { isLocked: !activeLayer.isLocked })}
                className={`p-1.5 rounded cursor-pointer ${
                  activeLayer.isLocked ? 'bg-amber-100 text-amber-800' : 'hover:bg-slate-200 text-slate-600'
                }`}
                title={activeLayer.isLocked ? 'Unlock layer' : 'Lock layer'}
              >
                {activeLayer.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => onDuplicateLayer(activeLayer.id)}
                className="p-1.5 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                title="Duplicate layer"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {layers.length > 1 && (
                <button
                  onClick={() => onDeleteLayer(activeLayer.id)}
                  className="p-1.5 hover:bg-rose-100 rounded text-rose-600 cursor-pointer"
                  title="Delete layer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <textarea
            rows={2}
            value={activeLayer.text}
            disabled={activeLayer.isLocked}
            onChange={(e) => onUpdateLayer(activeLayer.id, { text: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed font-sans focus:outline-none focus:border-blue-500 disabled:opacity-50"
            placeholder="Type your copy here..."
          />

          {/* Low Contrast Warning Notice */}
          {isLowContrast() && (
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                <strong>Readability Warning:</strong> Dark text on dark background. Try white text or enable a text background highlight.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Sub-Navigation Tabs for Detailed Design Settings */}
      <div className="flex border-b border-slate-200 gap-1 pb-2 overflow-x-auto font-medium text-slate-600 text-[11px]">
        {[
          { id: 'typography', label: 'Font & Style', icon: Type },
          { id: 'color', label: 'Color & Gradient', icon: Palette },
          { id: 'effects', label: 'Highlight & Shadow', icon: Sliders },
          { id: 'position', label: 'Placement & Align', icon: Move },
          { id: 'layers', label: 'Layer Order', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeLayer && (
        <>
          {/* TAB 1: TYPOGRAPHY CONTROLS */}
          {activeSubTab === 'typography' && (
            <div className="space-y-4">
              {/* Font Family Dropdown with categories */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-semibold">Font Family</label>
                  <span className="text-[10px] font-mono text-slate-500">
                    {FONT_SUPPORTED_WEIGHTS[activeLayer.fontFamily]
                      ? `${FONT_SUPPORTED_WEIGHTS[activeLayer.fontFamily].length} weights supported`
                      : 'Standard weights'}
                  </span>
                </div>
                <select
                  value={activeLayer.fontFamily}
                  onChange={(e) => {
                    const newFamily = e.target.value;
                    const supported = FONT_SUPPORTED_WEIGHTS[newFamily] || ['400', '700'];
                    let newWeight = activeLayer.fontWeight;
                    if (!supported.includes(newWeight)) {
                      newWeight = supported.includes('700') && parseInt(newWeight, 10) >= 600
                        ? '700'
                        : supported[0] || '400';
                    }
                    onUpdateLayer(activeLayer.id, { fontFamily: newFamily, fontWeight: newWeight });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <optgroup label="Serif (Editorial & Classic)">
                    {FONT_FAMILIES.filter((f) => f.category.includes('Serif')).map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} — {f.category}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Sans-Serif (Modern & Minimalist)">
                    {FONT_FAMILIES.filter((f) => f.category.includes('Sans-Serif')).map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} — {f.category}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Bold & Impact Display">
                    {FONT_FAMILIES.filter((f) => f.category.includes('Bold Display')).map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} — {f.category}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Handwritten & Script">
                    {FONT_FAMILIES.filter((f) => f.category.includes('Handwritten')).map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} — {f.category}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* SEPARATE CONTROL 1: FONT SIZE (Dimensions) */}
              <div className="p-3 bg-slate-50/75 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="text-slate-800 font-semibold block text-xs">Font Size</label>
                    <span className="text-[10px] text-slate-500">Logical text scale on canvas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="10"
                      max="240"
                      step="1"
                      value={activeLayer.fontSize}
                      onChange={(e) => {
                        const val = Math.max(10, Math.min(240, Number(e.target.value) || 12));
                        onUpdateLayer(activeLayer.id, { fontSize: val });
                      }}
                      className="w-16 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs text-right font-bold text-blue-700 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-xs font-mono text-slate-500">px</span>
                  </div>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min="10"
                  max="180"
                  step="1"
                  value={activeLayer.fontSize}
                  onChange={(e) => onUpdateLayer(activeLayer.id, { fontSize: Number(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer"
                />

                {/* Quick Size Presets */}
                <div className="flex items-center gap-1 pt-1 overflow-x-auto">
                  <span className="text-[10px] text-slate-400 font-mono mr-1">Presets:</span>
                  {[18, 24, 32, 48, 64, 72, 96].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => onUpdateLayer(activeLayer.id, { fontSize: sz })}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                        activeLayer.fontSize === sz
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {sz}px
                    </button>
                  ))}
                </div>
              </div>

              {/* SEPARATE CONTROL 2: FONT WEIGHT (Character Thickness) */}
              <div className="p-3 bg-slate-50/75 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="text-slate-800 font-semibold block text-xs">Font Weight</label>
                    <span className="text-[10px] text-slate-500">Character stroke thickness</span>
                  </div>
                  <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">
                    {WEIGHT_LABELS[activeLayer.fontWeight] || `${activeLayer.fontWeight}`}
                  </span>
                </div>

                {/* Weight Dropdown with supported indicators */}
                <select
                  value={activeLayer.fontWeight}
                  onChange={(e) => onUpdateLayer(activeLayer.id, { fontWeight: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium"
                >
                  {['300', '400', '500', '600', '700', '800', '900'].map((w) => {
                    const supportedList = FONT_SUPPORTED_WEIGHTS[activeLayer.fontFamily] || ['400', '700'];
                    const isSupported = supportedList.includes(w);
                    return (
                      <option key={w} value={w}>
                        {WEIGHT_LABELS[w]} {isSupported ? '✓' : '(fallback)'}
                      </option>
                    );
                  })}
                </select>

                {/* Supported weights note */}
                <div className="text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Available for selected font:</span>
                  <span className="font-mono font-medium text-slate-700">
                    {(FONT_SUPPORTED_WEIGHTS[activeLayer.fontFamily] || ['400', '700']).join(', ')}
                  </span>
                </div>
              </div>

              {/* Formatting Toggles: Bold, Italic, Underline & Alignment */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Style & Format</label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const currentWeightNum = parseInt(activeLayer.fontWeight, 10) || 400;
                        const supported = FONT_SUPPORTED_WEIGHTS[activeLayer.fontFamily] || ['400', '700'];
                        let targetWeight: string;
                        if (currentWeightNum >= 700) {
                          targetWeight = supported.includes('400') ? '400' : supported[0];
                        } else {
                          targetWeight = supported.includes('700')
                            ? '700'
                            : supported.filter((w) => parseInt(w, 10) >= 600).pop() || '700';
                        }
                        onUpdateLayer(activeLayer.id, { fontWeight: targetWeight });
                      }}
                      className={`p-2 rounded border cursor-pointer transition-colors ${
                        parseInt(activeLayer.fontWeight, 10) >= 700 || activeLayer.fontWeight === 'bold'
                          ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                      title={
                        parseInt(activeLayer.fontWeight, 10) >= 700
                          ? 'Bold Active (click to return to 400 Regular)'
                          : 'Make Bold (switches weight to 700 Bold)'
                      }
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateLayer(activeLayer.id, {
                          fontStyle: activeLayer.fontStyle === 'italic' ? 'normal' : 'italic',
                        })
                      }
                      className={`p-2 rounded border cursor-pointer transition-colors ${
                        activeLayer.fontStyle === 'italic'
                          ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Italic"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateLayer(activeLayer.id, {
                          textDecoration:
                            activeLayer.textDecoration === 'underline' ? 'none' : 'underline',
                        })
                      }
                      className={`p-2 rounded border cursor-pointer transition-colors ${
                        activeLayer.textDecoration === 'underline'
                          ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Underline"
                    >
                      <Underline className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Alignment</label>
                  <div className="flex items-center gap-1">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        type="button"
                        onClick={() => onUpdateLayer(activeLayer.id, { textAlign: align })}
                        className={`p-2 rounded border cursor-pointer transition-colors ${
                          activeLayer.textAlign === align
                            ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                        title={`Align ${align}`}
                      >
                        {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                        {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                        {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Letter Spacing, Line Height, Text Transform */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">
                    Letter Spacing ({activeLayer.letterSpacing}px)
                  </label>
                  <input
                    type="range"
                    min="-2"
                    max="10"
                    step="0.5"
                    value={activeLayer.letterSpacing}
                    onChange={(e) =>
                      onUpdateLayer(activeLayer.id, { letterSpacing: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">
                    Line Height ({activeLayer.lineHeight})
                  </label>
                  <input
                    type="range"
                    min="0.8"
                    max="2.0"
                    step="0.05"
                    value={activeLayer.lineHeight}
                    onChange={(e) =>
                      onUpdateLayer(activeLayer.id, { lineHeight: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Transform</label>
                  <select
                    value={activeLayer.textTransform}
                    onChange={(e) =>
                      onUpdateLayer(activeLayer.id, { textTransform: e.target.value as TextTransform })
                    }
                    className="w-full px-2 py-1 bg-slate-50 border rounded text-[11px]"
                  >
                    <option value="none">Normal Case</option>
                    <option value="uppercase">UPPERCASE</option>
                    <option value="lowercase">lowercase</option>
                    <option value="capitalize">Title Case</option>
                  </select>
                </div>
              </div>

              {/* Rotation & Opacity */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] text-slate-600 font-semibold">
                      Rotation ({activeLayer.rotation}°)
                    </label>
                    <button
                      onClick={() => onUpdateLayer(activeLayer.id, { rotation: 0 })}
                      className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                    >
                      Reset 0°
                    </button>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={activeLayer.rotation}
                    onChange={(e) => onUpdateLayer(activeLayer.id, { rotation: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 font-semibold mb-1">
                    Opacity ({activeLayer.opacity}%)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={activeLayer.opacity}
                    onChange={(e) => onUpdateLayer(activeLayer.id, { opacity: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COLOR & GRADIENT CONTROLS */}
          {activeSubTab === 'color' && (
            <div className="space-y-4">
              {/* Main Color Picker */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Primary Font Color</span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {hexToRgbString(activeLayer.color)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={activeLayer.color}
                    onChange={(e) => handleColorPick(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border"
                  />
                  <input
                    type="text"
                    value={activeLayer.color}
                    onChange={(e) => handleColorPick(e.target.value)}
                    className="px-3 py-1.5 bg-white border rounded font-mono text-xs flex-1"
                  />
                </div>
              </div>

              {/* Brand Color Presets */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">
                  Brand Color Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {BRAND_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => handleColorPick(c.hex)}
                      className="w-7 h-7 rounded-full border border-slate-300 cursor-pointer shadow-xs transition-transform hover:scale-110 flex items-center justify-center"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {activeLayer.color.toUpperCase() === c.hex.toUpperCase() && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            ['#FFFFFF', '#FAF8F4'].includes(c.hex) ? 'text-slate-900' : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recently Used Colors */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">Recently Used</label>
                <div className="flex gap-2">
                  {recentColors.map((hex, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleColorPick(hex)}
                      className="w-6 h-6 rounded border border-slate-300 cursor-pointer"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>

              {/* Text Gradient Option */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Text Gradient Fill</span>
                  <input
                    type="checkbox"
                    checked={Boolean(activeLayer.isGradientText)}
                    onChange={(e) =>
                      onUpdateLayer(activeLayer.id, {
                        isGradientText: e.target.checked,
                        textGradient: activeLayer.textGradient || {
                          from: activeLayer.color,
                          to: '#FBBF24',
                          direction: 'to-r',
                        },
                      })
                    }
                    className="accent-blue-600 cursor-pointer"
                  />
                </div>

                {activeLayer.isGradientText && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">From</label>
                      <input
                        type="color"
                        value={activeLayer.textGradient?.from || activeLayer.color}
                        onChange={(e) =>
                          onUpdateLayer(activeLayer.id, {
                            textGradient: {
                              ...activeLayer.textGradient!,
                              from: e.target.value,
                            },
                          })
                        }
                        className="w-full h-8 rounded border cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">To</label>
                      <input
                        type="color"
                        value={activeLayer.textGradient?.to || '#FBBF24'}
                        onChange={(e) =>
                          onUpdateLayer(activeLayer.id, {
                            textGradient: {
                              ...activeLayer.textGradient!,
                              to: e.target.value,
                            },
                          })
                        }
                        className="w-full h-8 rounded border cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: HIGHLIGHT & SHADOW EFFECTS */}
          {activeSubTab === 'effects' && (
            <div className="space-y-4">
              {/* Text Background Highlight / Pill / Badge */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">
                    Background Highlight / Pill
                  </span>
                  <input
                    type="checkbox"
                    checked={Boolean(activeLayer.hasBackground)}
                    onChange={(e) =>
                      onUpdateLayer(activeLayer.id, {
                        hasBackground: e.target.checked,
                        backgroundColor: activeLayer.backgroundColor || '#FBBF24',
                        backgroundOpacity: activeLayer.backgroundOpacity ?? 100,
                        backgroundRadius: activeLayer.backgroundRadius ?? 25,
                        backgroundPaddingX: activeLayer.backgroundPaddingX ?? 18,
                        backgroundPaddingY: activeLayer.backgroundPaddingY ?? 8,
                      })
                    }
                    className="accent-blue-600 cursor-pointer"
                  />
                </div>

                {activeLayer.hasBackground && (
                  <div className="space-y-3 pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={activeLayer.backgroundColor || '#FBBF24'}
                        onChange={(e) =>
                          onUpdateLayer(activeLayer.id, { backgroundColor: e.target.value })
                        }
                        className="w-8 h-8 rounded cursor-pointer border"
                      />
                      <div className="flex-1">
                        <label className="block text-[11px] text-slate-600">
                          Background Opacity ({activeLayer.backgroundOpacity}%)
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={activeLayer.backgroundOpacity ?? 100}
                          onChange={(e) =>
                            onUpdateLayer(activeLayer.id, {
                              backgroundOpacity: Number(e.target.value),
                            })
                          }
                          className="w-full accent-blue-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-1">
                          Corner Radius ({activeLayer.backgroundRadius}px)
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={activeLayer.backgroundRadius ?? 25}
                          onChange={(e) =>
                            onUpdateLayer(activeLayer.id, {
                              backgroundRadius: Number(e.target.value),
                            })
                          }
                          className="w-full accent-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-1">
                          Padding X ({activeLayer.backgroundPaddingX}px)
                        </label>
                        <input
                          type="range"
                          min="4"
                          max="32"
                          value={activeLayer.backgroundPaddingX ?? 18}
                          onChange={(e) =>
                            onUpdateLayer(activeLayer.id, {
                              backgroundPaddingX: Number(e.target.value),
                            })
                          }
                          className="w-full accent-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Text Shadow */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Drop Shadow</span>
                  <input
                    type="checkbox"
                    checked={Boolean(activeLayer.hasShadow)}
                    onChange={(e) =>
                      onUpdateLayer(activeLayer.id, {
                        hasShadow: e.target.checked,
                        shadowColor: activeLayer.shadowColor || 'rgba(0,0,0,0.7)',
                        shadowBlur: activeLayer.shadowBlur ?? 8,
                        shadowOffsetY: activeLayer.shadowOffsetY ?? 3,
                      })
                    }
                    className="accent-blue-600 cursor-pointer"
                  />
                </div>

                {activeLayer.hasShadow && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">
                        Blur ({activeLayer.shadowBlur}px)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="24"
                        value={activeLayer.shadowBlur ?? 8}
                        onChange={(e) =>
                          onUpdateLayer(activeLayer.id, { shadowBlur: Number(e.target.value) })
                        }
                        className="w-full accent-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">
                        Y Offset ({activeLayer.shadowOffsetY}px)
                      </label>
                      <input
                        type="range"
                        min="-10"
                        max="20"
                        value={activeLayer.shadowOffsetY ?? 3}
                        onChange={(e) =>
                          onUpdateLayer(activeLayer.id, { shadowOffsetY: Number(e.target.value) })
                        }
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Text Outline / Stroke */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Text Stroke / Outline</span>
                  <input
                    type="checkbox"
                    checked={Boolean(activeLayer.hasOutline)}
                    onChange={(e) =>
                      onUpdateLayer(activeLayer.id, {
                        hasOutline: e.target.checked,
                        outlineColor: activeLayer.outlineColor || '#000000',
                        outlineWidth: activeLayer.outlineWidth ?? 2,
                      })
                    }
                    className="accent-blue-600 cursor-pointer"
                  />
                </div>

                {activeLayer.hasOutline && (
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="color"
                      value={activeLayer.outlineColor || '#000000'}
                      onChange={(e) =>
                        onUpdateLayer(activeLayer.id, { outlineColor: e.target.value })
                      }
                      className="w-8 h-8 rounded border cursor-pointer"
                    />
                    <div className="flex-1">
                      <label className="block text-[11px] text-slate-600">
                        Width ({activeLayer.outlineWidth}px)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        value={activeLayer.outlineWidth ?? 2}
                        onChange={(e) =>
                          onUpdateLayer(activeLayer.id, { outlineWidth: Number(e.target.value) })
                        }
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: POSITION & ALIGNMENT GUIDES */}
          {activeSubTab === 'position' && (
            <div className="space-y-4">
              {/* Manual Position X & Y Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] text-slate-600 font-semibold">
                      Horizontal (X): {Math.round(activeLayer.x)}%
                    </label>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="90"
                    value={activeLayer.x}
                    onChange={(e) => onUpdateLayer(activeLayer.id, { x: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] text-slate-600 font-semibold">
                      Vertical (Y): {Math.round(activeLayer.y)}%
                    </label>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="92"
                    value={activeLayer.y}
                    onChange={(e) => onUpdateLayer(activeLayer.id, { y: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>

              {/* Quick Canvas Alignment Actions */}
              <div>
                <label className="block text-slate-600 font-semibold mb-2">
                  Quick Canvas Alignment
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onUpdateLayer(activeLayer.id, { x: 8, textAlign: 'left' })}
                    className="p-2 border rounded hover:bg-slate-50 text-[11px] font-medium text-slate-700 cursor-pointer"
                  >
                    Align Left
                  </button>
                  <button
                    onClick={() => {
                      const width = activeLayer.width || 80;
                      const newX = Math.round((100 - width) / 2);
                      onUpdateLayer(activeLayer.id, { x: newX, width, textAlign: 'center' });
                    }}
                    className="p-2 border rounded hover:bg-slate-50 text-[11px] font-medium text-slate-700 cursor-pointer"
                  >
                    Center Horiz.
                  </button>
                  <button
                    onClick={() => {
                      const width = activeLayer.width || 80;
                      const newX = Math.max(0, 100 - width - 8);
                      onUpdateLayer(activeLayer.id, { x: newX, textAlign: 'right' });
                    }}
                    className="p-2 border rounded hover:bg-slate-50 text-[11px] font-medium text-slate-700 cursor-pointer"
                  >
                    Align Right
                  </button>
                  <button
                    onClick={() => onUpdateLayer(activeLayer.id, { y: 8 })}
                    className="p-2 border rounded hover:bg-slate-50 text-[11px] font-medium text-slate-700 cursor-pointer"
                  >
                    Align Top
                  </button>
                  <button
                    onClick={() => onUpdateLayer(activeLayer.id, { y: 48 })}
                    className="p-2 border rounded hover:bg-slate-50 text-[11px] font-medium text-slate-700 cursor-pointer"
                  >
                    Center Vert.
                  </button>
                  <button
                    onClick={() => onUpdateLayer(activeLayer.id, { y: 88 })}
                    className="p-2 border rounded hover:bg-slate-50 text-[11px] font-medium text-slate-700 cursor-pointer"
                  >
                    Align Bottom
                  </button>
                </div>
              </div>

              {/* Safe Margins and Grid Toggles */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-semibold text-slate-800 block">
                  Layout & Visual Guides
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Pinterest Safe Margins Overlay</span>
                  <input
                    type="checkbox"
                    checked={showSafeMargins}
                    onChange={onToggleSafeMargins}
                    className="accent-blue-600 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Rule-of-Thirds Alignment Grid</span>
                  <input
                    type="checkbox"
                    checked={showGridGuides}
                    onChange={onToggleGridGuides}
                    className="accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LAYER ORDER & STACKING */}
          {activeSubTab === 'layers' && (
            <div className="space-y-3">
              <label className="block text-slate-700 font-semibold">Layer Stack (Top to Bottom)</label>
              <div className="space-y-1.5 divide-y divide-slate-100">
                {layers
                  .slice()
                  .sort((a, b) => b.zIndex - a.zIndex)
                  .map((layer, idx) => (
                    <div
                      key={layer.id}
                      onClick={() => onSelectLayer(layer.id)}
                      className={`p-2.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                        selectedLayerId === layer.id ? 'bg-blue-50 border border-blue-300' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400">#{idx + 1}</span>
                        <div>
                          <div className="font-semibold text-slate-900 truncate max-w-[150px]">
                            {layer.text || `[${layer.presetType}]`}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {layer.presetType} · zIndex: {layer.zIndex}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveLayerZ(layer.id, 'up');
                          }}
                          className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                          title="Bring Forward"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveLayerZ(layer.id, 'down');
                          }}
                          className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                          title="Send Backward"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
