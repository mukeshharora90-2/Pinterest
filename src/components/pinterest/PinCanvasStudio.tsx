// =============================================================================
// VeritasCraft — Pinterest Studio Pro
// Upgraded with Complete Customizable Text Design, Readability/Layout Tools,
// Music & MP3 Audio Controls, and High-Resolution Multi-Size Export Engine
// =============================================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  PinDesign,
  PinSizePreset,
  PinBackgroundType,
  PinBackgroundConfig,
  PinTextLayer,
  TextPresetType,
  PinAudioConfig,
} from '../../types';
import { toPng, toJpeg } from 'html-to-image';
import { TextSettingsPanel } from './TextSettingsPanel';
import { AudioSettingsPanel } from './AudioSettingsPanel';
import { mixAudioIntoVideoStream, CURATED_AUDIO_TRACKS } from './audioUtils';
import {
  Download,
  Bookmark,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Undo2,
  Redo2,
  Image as ImageIcon,
  Video,
  Palette,
  Maximize2,
  Sliders,
  Volume2,
  VolumeX,
  Play,
  Pause,
  AlertCircle,
  Upload,
  RefreshCw,
  ExternalLink,
  Layers,
  FileVideo,
  FileImage,
  Loader2,
  Eye,
  Info,
  Trash2,
  Camera,
  Scissors,
  HelpCircle,
  ArrowRight,
  Move,
  Grid,
  Music,
  Type,
  Lock,
  Unlock,
  Plus,
} from 'lucide-react';

// Exact Canvas Dimensions
export const PIN_SIZE_PRESETS: {
  id: PinSizePreset;
  label: string;
  ratioLabel: string;
  width: number;
  height: number;
  aspectRatio: string;
  recommendation: string;
}[] = [
  {
    id: 'standard',
    label: 'Standard Pin',
    ratioLabel: '2:3',
    width: 1000,
    height: 1500,
    aspectRatio: '2/3',
    recommendation: 'Official Pinterest recommendation for highest feed reach and organic click-throughs.',
  },
  {
    id: 'square',
    label: 'Square Pin',
    ratioLabel: '1:1',
    width: 1000,
    height: 1000,
    aspectRatio: '1/1',
    recommendation: 'Ideal for multi-image product carousels, catalog ads, and cross-posting to Instagram.',
  },
  {
    id: 'vertical_video',
    label: 'Vertical / Video Pin',
    ratioLabel: '9:16',
    width: 1080,
    height: 1920,
    aspectRatio: '9/16',
    recommendation: 'Full-screen mobile video pins, Idea pins, and video ads with immersive impact.',
  },
  {
    id: 'taller',
    label: 'Taller Pin',
    ratioLabel: '1:2.1',
    width: 1000,
    height: 2100,
    aspectRatio: '1/2.1',
    recommendation: 'Maximum height format before truncation. Excellent for long-form infographics and step guides.',
  },
  {
    id: 'custom',
    label: 'Custom Size',
    ratioLabel: 'Custom',
    width: 1000,
    height: 1500,
    aspectRatio: 'custom',
    recommendation: 'Custom width & height (min 400px, max 3000px) tailored to specialized campaign specs.',
  },
];

// Curated Media Library Presets
const MEDIA_LIBRARY_IMAGES = [
  {
    id: 'limestone',
    name: 'Aesthetic Limestone Desk',
    category: 'Workspace',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    fallbackColor: '#E8E5DF',
  },
  {
    id: 'minimal_workspace',
    name: 'Minimalist Obsidian Desk',
    category: 'Technology',
    url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80',
    fallbackColor: '#1E232A',
  },
  {
    id: 'linen_paper',
    name: 'Warm Linen Paper Texture',
    category: 'Stationery',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    fallbackColor: '#F4EFE6',
  },
  {
    id: 'studio_shadow',
    name: 'Sunlight Architectural Shadow',
    category: 'Minimal',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    fallbackColor: '#1E3A8A',
  },
  {
    id: 'ceramic_table',
    name: 'Beige Ceramic & Editorial Flora',
    category: 'Lifestyle',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    fallbackColor: '#EADBC8',
  },
  {
    id: 'marble_luxury',
    name: 'Champagne Vein Marble',
    category: 'Textures',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    fallbackColor: '#D8D4CD',
  },
  {
    id: 'coffee_planner',
    name: 'Espresso & Open Journal',
    category: 'Workspace',
    url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    fallbackColor: '#2B2623',
  },
  {
    id: 'abstract_geometry',
    name: 'Architectural Warm Arches',
    category: 'Abstract',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    fallbackColor: '#D9C5B2',
  },
];

const MEDIA_LIBRARY_VIDEOS = [
  {
    id: 'desk_ambience',
    name: 'Curated Creator Desk Looping Motion',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-computer-43527-large.mp4',
    poster: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    duration: '10s',
  },
  {
    id: 'paper_turn',
    name: 'Editorial Pages & Journal Motion',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-43528-large.mp4',
    poster: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    duration: '12s',
  },
  {
    id: 'coffee_morning',
    name: 'Morning Light & Writing Focus',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-coffee-cup-on-a-wooden-table-with-natural-light-43529-large.mp4',
    poster: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    duration: '8s',
  },
];

const FOCAL_POINTS: { id: string; label: string; x: number; y: number }[] = [
  { id: 'top-left', label: 'TL', x: 0, y: 0 },
  { id: 'top-center', label: 'TC', x: 50, y: 0 },
  { id: 'top-right', label: 'TR', x: 100, y: 0 },
  { id: 'center-left', label: 'CL', x: 0, y: 50 },
  { id: 'center', label: 'C', x: 50, y: 50 },
  { id: 'center-right', label: 'CR', x: 100, y: 50 },
  { id: 'bottom-left', label: 'BL', x: 0, y: 100 },
  { id: 'bottom-center', label: 'BC', x: 50, y: 100 },
  { id: 'bottom-right', label: 'BR', x: 100, y: 100 },
];

const INITIAL_TEXT_LAYERS: PinTextLayer[] = [
  {
    id: 'layer-brand',
    presetType: 'brand_logo',
    text: 'VERITASCRAFT.COM',
    x: 8,
    y: 5.5,
    rotation: 0,
    zIndex: 10,
    isLocked: false,
    fontFamily: "'Plus Jakarta Sans', monospace",
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
    letterSpacing: 2,
    lineHeight: 1.2,
    textTransform: 'uppercase',
    color: '#FFFFFF',
    opacity: 90,
    hasShadow: true,
    shadowColor: 'rgba(0,0,0,0.6)',
    shadowBlur: 6,
    shadowOffsetY: 2,
  },
  {
    id: 'layer-board',
    presetType: 'price_badge',
    text: 'DIGITAL PRODUCT MARKETING',
    x: 62,
    y: 5.2,
    rotation: 0,
    zIndex: 11,
    isLocked: false,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 14,
    fontWeight: '700',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 1.2,
    textTransform: 'uppercase',
    color: '#FFFFFF',
    opacity: 100,
    hasBackground: true,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    backgroundOpacity: 100,
    backgroundRadius: 20,
    backgroundPaddingX: 12,
    backgroundPaddingY: 4,
  },
  {
    id: 'layer-headline',
    presetType: 'headline',
    text: 'How We Drove 240,000 Monthly Pageviews from Pinterest',
    x: 8,
    y: 38,
    width: 84,
    rotation: 0,
    zIndex: 20,
    isLocked: false,
    fontFamily: "'Playfair Display', serif",
    fontSize: 48,
    fontWeight: '700',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
    letterSpacing: -0.5,
    lineHeight: 1.2,
    textTransform: 'none',
    color: '#FFFFFF',
    opacity: 100,
    hasShadow: true,
    shadowColor: 'rgba(0,0,0,0.8)',
    shadowBlur: 14,
    shadowOffsetY: 4,
  },
  {
    id: 'layer-subtitle',
    presetType: 'subtitle',
    text: 'The Organic Traffic Blueprint for Digital Downloads & Notion Workspaces',
    x: 8,
    y: 58,
    width: 84,
    rotation: 0,
    zIndex: 21,
    isLocked: false,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 22,
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
    letterSpacing: 0,
    lineHeight: 1.4,
    textTransform: 'none',
    color: 'rgba(255, 255, 255, 0.92)',
    opacity: 95,
    hasShadow: true,
    shadowColor: 'rgba(0,0,0,0.6)',
    shadowBlur: 8,
    shadowOffsetY: 2,
  },
  {
    id: 'layer-cta',
    presetType: 'cta_button',
    text: 'Read the Blueprint →',
    x: 8,
    y: 88,
    rotation: 0,
    zIndex: 30,
    isLocked: false,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 20,
    fontWeight: '700',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 1.2,
    textTransform: 'none',
    color: '#0F172A',
    opacity: 100,
    hasBackground: true,
    backgroundColor: '#FBBF24',
    backgroundOpacity: 100,
    backgroundRadius: 25,
    backgroundPaddingX: 18,
    backgroundPaddingY: 9,
    hasShadow: true,
    shadowColor: 'rgba(0,0,0,0.35)',
    shadowBlur: 12,
    shadowOffsetY: 4,
  },
  {
    id: 'layer-save',
    presetType: 'custom',
    text: 'Save Idea 📌',
    x: 72,
    y: 89.5,
    rotation: 0,
    zIndex: 31,
    isLocked: false,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'right',
    letterSpacing: 0.5,
    lineHeight: 1.2,
    textTransform: 'none',
    color: '#FFFFFF',
    opacity: 90,
  },
];

interface PinStateHistory {
  sizePreset: PinSizePreset;
  canvasWidth: number;
  canvasHeight: number;
  backgroundConfig: PinBackgroundConfig;
  textLayers: PinTextLayer[];
  audioConfig: PinAudioConfig;
  destinationUrl: string;
  pinTitle: string;
  pinDescription: string;
  boardName: string;
}

export const PinCanvasStudio: React.FC = () => {
  const {
    pins,
    setPins,
    blogPosts,
    products,
    showNotification,
    transferredPinData,
    clearTransferredPinData,
  } = useStore();

  // ---------------------------------------------------------------------------
  // Canvas Size State & Dimensions
  // ---------------------------------------------------------------------------
  const [sizePreset, setSizePreset] = useState<PinSizePreset>(() => {
    const saved = localStorage.getItem('vc_current_pin_size');
    return (saved as PinSizePreset) || 'standard';
  });
  const [canvasWidth, setCanvasWidth] = useState<number>(() => {
    const saved = localStorage.getItem('vc_current_pin_width');
    return saved ? Number(saved) : 1000;
  });
  const [canvasHeight, setCanvasHeight] = useState<number>(() => {
    const saved = localStorage.getItem('vc_current_pin_height');
    return saved ? Number(saved) : 1500;
  });

  // Save selected size to local storage
  useEffect(() => {
    localStorage.setItem('vc_current_pin_size', sizePreset);
    localStorage.setItem('vc_current_pin_width', canvasWidth.toString());
    localStorage.setItem('vc_current_pin_height', canvasHeight.toString());
  }, [sizePreset, canvasWidth, canvasHeight]);

  // ---------------------------------------------------------------------------
  // Fully Customizable Text Layers State
  // ---------------------------------------------------------------------------
  const [textLayers, setTextLayers] = useState<PinTextLayer[]>(() => {
    const saved = localStorage.getItem('vc_current_pin_layers');
    return saved ? JSON.parse(saved) : INITIAL_TEXT_LAYERS;
  });
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>('layer-headline');

  // Persist layers
  useEffect(() => {
    localStorage.setItem('vc_current_pin_layers', JSON.stringify(textLayers));
  }, [textLayers]);

  // Visual layout guides
  const [showSafeMargins, setShowSafeMargins] = useState<boolean>(false);
  const [showGridGuides, setShowGridGuides] = useState<boolean>(false);

  // Dragging state for interactive canvas manipulation
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const [layerInitialPos, setLayerInitialPos] = useState<{ x: number; y: number } | null>(null);

  // ---------------------------------------------------------------------------
  // Background Configuration State
  // ---------------------------------------------------------------------------
  const [backgroundConfig, setBackgroundConfig] = useState<PinBackgroundConfig>({
    type: 'gradient',
    color: '#1E3A8A',
    gradient: { from: '#1E3A8A', to: '#0F172A', direction: 'to-br' },
    imageUrl: '',
    videoUrl: '',
    imageFit: 'cover',
    position: { x: 50, y: 50 },
    zoom: 1.0,
    brightness: 100,
    contrast: 100,
    blur: 0,
    opacity: 100,
    overlayColor: '#000000',
    overlayOpacity: 35,
    overlayType: 'gradient',
    overlayGradient: { from: 'rgba(0,0,0,0.1)', to: 'rgba(0,0,0,0.75)', direction: 'to-b' },
    focalPointPreset: 'center',
    videoFit: 'cover',
    videoMuted: true,
    videoTrimStart: 0,
    videoTrimEnd: 15,
    videoPosterUrl: '',
  });

  // ---------------------------------------------------------------------------
  // Music & Audio Configuration State
  // ---------------------------------------------------------------------------
  const [audioConfig, setAudioConfig] = useState<PinAudioConfig>({
    sourceType: 'none',
    audioUrl: '',
    audioName: '',
    volume: 80,
    isMuted: false,
    startTime: 0,
    fadeInSeconds: 1,
    fadeOutSeconds: 1,
  });

  // Video playback controls
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // Pinterest Metadata
  const [destinationUrl, setDestinationUrl] = useState('/blog/pinterest-organic-traffic-blueprint-digital-products');
  const [pinTitle, setPinTitle] = useState('How to Drive 240,000 Monthly Pageviews to Digital Products (Case Study)');
  const [pinDescription, setPinDescription] = useState('Discover the 2:3 vertical Pin strategy, keyword placement, and fresh pin cadence that generated over 240,000 monthly pageviews. Click to read the complete breakdown!');
  const [boardName, setBoardName] = useState('Digital Product Marketing & Growth');

  // Active Tool Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'size' | 'background' | 'text_settings' | 'audio' | 'metadata' | 'ai_assistant' | 'export'
  >('size');

  // Export State
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg' | 'mp4'>('png');
  const [exportEngine, setExportEngine] = useState<'compositor' | 'dom_snapshot'>('compositor');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState<string | null>(null);

  // Inline AI Assistant State
  const [aiAssistantPrompt, setAiAssistantPrompt] = useState('');
  const [aiAssistantTask, setAiAssistantTask] = useState<'pin_title' | 'pin_description' | 'pin_keywords' | 'pin_hashtags'>('pin_title');
  const [aiAssistantLoading, setAiAssistantLoading] = useState(false);
  const [aiAssistantOutput, setAiAssistantOutput] = useState<string | null>(null);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<PinStateHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // DOM node to render
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const [previewContainerWidth, setPreviewContainerWidth] = useState<number>(384);

  // Monitor preview container dimensions to accurately scale preview text
  useEffect(() => {
    if (!canvasContainerRef.current) return;
    const updateSize = () => {
      if (canvasContainerRef.current) {
        const w = canvasContainerRef.current.clientWidth;
        if (w > 0) setPreviewContainerWidth(w);
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(canvasContainerRef.current);
    return () => ro.disconnect();
  }, [canvasWidth, sizePreset]);

  // Load transferred data from AI Studio if available
  useEffect(() => {
    if (transferredPinData) {
      if (transferredPinData.title) setPinTitle(transferredPinData.title);
      if (transferredPinData.description) setPinDescription(transferredPinData.description);
      if (transferredPinData.headline) {
        setTextLayers((prev) =>
          prev.map((l) => (l.presetType === 'headline' ? { ...l, text: transferredPinData.headline! } : l))
        );
      }
      showNotification('Loaded AI-generated title & copy into Pinterest Studio!');
      clearTransferredPinData();
    }
  }, [transferredPinData]);

  // Current State Snapshot for History
  const getCurrentState = useCallback((): PinStateHistory => ({
    sizePreset,
    canvasWidth,
    canvasHeight,
    backgroundConfig: JSON.parse(JSON.stringify(backgroundConfig)),
    textLayers: JSON.parse(JSON.stringify(textLayers)),
    audioConfig: JSON.parse(JSON.stringify(audioConfig)),
    destinationUrl,
    pinTitle,
    pinDescription,
    boardName,
  }), [
    sizePreset,
    canvasWidth,
    canvasHeight,
    backgroundConfig,
    textLayers,
    audioConfig,
    destinationUrl,
    pinTitle,
    pinDescription,
    boardName,
  ]);

  // Push to history
  const pushState = useCallback((newState?: Partial<PinStateHistory>) => {
    const currentState = { ...getCurrentState(), ...(newState || {}) };
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      sliced.push(currentState);
      if (sliced.length > 30) sliced.shift();
      return sliced;
    });
    setHistoryIndex((prev) => prev + 1);
  }, [getCurrentState, historyIndex]);

  // Undo Handler
  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetState = history[historyIndex - 1];
      applyHistoryState(targetState);
      setHistoryIndex(historyIndex - 1);
      showNotification('Action undone');
    }
  };

  // Redo Handler
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetState = history[historyIndex + 1];
      applyHistoryState(targetState);
      setHistoryIndex(historyIndex + 1);
      showNotification('Action redone');
    }
  };

  const applyHistoryState = (s: PinStateHistory) => {
    setSizePreset(s.sizePreset);
    setCanvasWidth(s.canvasWidth);
    setCanvasHeight(s.canvasHeight);
    setBackgroundConfig(s.backgroundConfig);
    setTextLayers(s.textLayers);
    setAudioConfig(s.audioConfig);
    setDestinationUrl(s.destinationUrl);
    setPinTitle(s.pinTitle);
    setPinDescription(s.pinDescription);
    setBoardName(s.boardName);
  };

  // ---------------------------------------------------------------------------
  // Canvas Size Selector: Presets & Custom Adaptation
  // ---------------------------------------------------------------------------
  const handleSelectSizePreset = (presetId: PinSizePreset) => {
    const preset = PIN_SIZE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setSizePreset(presetId);
    setCanvasWidth(preset.width);
    setCanvasHeight(preset.height);

    // Adapt text layers intelligently without erasing custom typography
    if (presetId === 'square') {
      // Compress vertical spacing slightly for 1:1 square
      setTextLayers((prev) =>
        prev.map((l) => {
          if (l.presetType === 'headline') return { ...l, y: 30 };
          if (l.presetType === 'subtitle') return { ...l, y: 55 };
          if (l.presetType === 'cta_button') return { ...l, y: 84 };
          return l;
        })
      );
    } else if (presetId === 'vertical_video' || presetId === 'taller') {
      // Give more vertical breathing room for tall 9:16 or 1:2.1
      setTextLayers((prev) =>
        prev.map((l) => {
          if (l.presetType === 'headline') return { ...l, y: 38 };
          if (l.presetType === 'subtitle') return { ...l, y: 58 };
          if (l.presetType === 'cta_button') return { ...l, y: 88 };
          return l;
        })
      );
    }

    if (presetId === 'vertical_video' && backgroundConfig.videoUrl) {
      setExportFormat('mp4');
    }

    pushState({
      sizePreset: presetId,
      canvasWidth: preset.width,
      canvasHeight: preset.height,
    });

    showNotification(`Canvas resized to ${preset.label} (${preset.width} × ${preset.height} px)`);
  };

  const handleCustomDimensionsChange = (w: number, h: number) => {
    const clampedW = Math.max(400, Math.min(2400, w || 1000));
    const clampedH = Math.max(400, Math.min(3000, h || 1500));
    setSizePreset('custom');
    setCanvasWidth(clampedW);
    setCanvasHeight(clampedH);
  };

  // ---------------------------------------------------------------------------
  // Layer Management Handlers
  // ---------------------------------------------------------------------------
  const handleUpdateLayer = (id: string, updates: Partial<PinTextLayer>) => {
    setTextLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  const handleAddLayer = (preset: TextPresetType) => {
    const newId = `layer-${Date.now()}`;
    const maxZ = Math.max(...textLayers.map((l) => l.zIndex), 0) + 1;

    let newLayer: PinTextLayer;
    switch (preset) {
      case 'headline':
        newLayer = {
          id: newId,
          presetType: 'headline',
          text: 'New Bold Headline',
          x: 10,
          y: 45,
          width: 80,
          rotation: 0,
          zIndex: maxZ,
          isLocked: false,
          fontFamily: "'Playfair Display', serif",
          fontSize: 48,
          fontWeight: '700',
          fontStyle: 'normal',
          textDecoration: 'none',
          textAlign: 'center',
          letterSpacing: 0,
          lineHeight: 1.2,
          textTransform: 'none',
          color: '#FFFFFF',
          opacity: 100,
          hasShadow: true,
          shadowColor: 'rgba(0,0,0,0.7)',
          shadowBlur: 10,
          shadowOffsetY: 3,
        };
        break;
      case 'subtitle':
        newLayer = {
          id: newId,
          presetType: 'subtitle',
          text: 'Add your supporting editorial subheadline here',
          x: 10,
          y: 65,
          width: 80,
          rotation: 0,
          zIndex: maxZ,
          isLocked: false,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 22,
          fontWeight: '400',
          fontStyle: 'normal',
          textDecoration: 'none',
          textAlign: 'center',
          letterSpacing: 0,
          lineHeight: 1.4,
          textTransform: 'none',
          color: 'rgba(255, 255, 255, 0.9)',
          opacity: 95,
        };
        break;
      case 'cta_button':
        newLayer = {
          id: newId,
          presetType: 'cta_button',
          text: 'Shop Collection →',
          x: 25,
          y: 85,
          rotation: 0,
          zIndex: maxZ,
          isLocked: false,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 20,
          fontWeight: '700',
          fontStyle: 'normal',
          textDecoration: 'none',
          textAlign: 'center',
          letterSpacing: 0.5,
          lineHeight: 1.2,
          textTransform: 'none',
          color: '#0F172A',
          opacity: 100,
          hasBackground: true,
          backgroundColor: '#FBBF24',
          backgroundOpacity: 100,
          backgroundRadius: 25,
          backgroundPaddingX: 20,
          backgroundPaddingY: 10,
          hasShadow: true,
          shadowColor: 'rgba(0,0,0,0.3)',
          shadowBlur: 10,
          shadowOffsetY: 4,
        };
        break;
      case 'price_badge':
        newLayer = {
          id: newId,
          presetType: 'price_badge',
          text: '$39 • INSTANT DOWNLOAD',
          x: 10,
          y: 15,
          rotation: 0,
          zIndex: maxZ,
          isLocked: false,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 16,
          fontWeight: '700',
          fontStyle: 'normal',
          textDecoration: 'none',
          textAlign: 'center',
          letterSpacing: 1,
          lineHeight: 1.2,
          textTransform: 'uppercase',
          color: '#FFFFFF',
          opacity: 100,
          hasBackground: true,
          backgroundColor: '#3157D5',
          backgroundOpacity: 100,
          backgroundRadius: 15,
          backgroundPaddingX: 12,
          backgroundPaddingY: 5,
        };
        break;
      case 'website_url':
        newLayer = {
          id: newId,
          presetType: 'website_url',
          text: 'www.veritascraft.com',
          x: 10,
          y: 93,
          rotation: 0,
          zIndex: maxZ,
          isLocked: false,
          fontFamily: "'Plus Jakarta Sans', monospace",
          fontSize: 16,
          fontWeight: '600',
          fontStyle: 'normal',
          textDecoration: 'none',
          textAlign: 'left',
          letterSpacing: 1,
          lineHeight: 1.2,
          textTransform: 'lowercase',
          color: '#FFFFFF',
          opacity: 80,
        };
        break;
      default:
        newLayer = {
          id: newId,
          presetType: 'custom',
          text: 'Custom Text Element',
          x: 20,
          y: 50,
          rotation: 0,
          zIndex: maxZ,
          isLocked: false,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 18,
          fontWeight: '600',
          fontStyle: 'normal',
          textDecoration: 'none',
          textAlign: 'left',
          letterSpacing: 0,
          lineHeight: 1.3,
          textTransform: 'none',
          color: '#FFFFFF',
          opacity: 100,
        };
        break;
    }

    setTextLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newId);
    setActiveTab('text_settings');
    pushState();
    showNotification(`Added new text element: "${newLayer.text}"`);
  };

  const handleDuplicateLayer = (id: string) => {
    const source = textLayers.find((l) => l.id === id);
    if (!source) return;

    const newId = `layer-${Date.now()}`;
    const maxZ = Math.max(...textLayers.map((l) => l.zIndex), 0) + 1;
    const duplicated: PinTextLayer = {
      ...JSON.parse(JSON.stringify(source)),
      id: newId,
      x: Math.min(85, source.x + 3),
      y: Math.min(85, source.y + 3),
      zIndex: maxZ,
    };

    setTextLayers((prev) => [...prev, duplicated]);
    setSelectedLayerId(newId);
    pushState();
    showNotification('Duplicated text layer');
  };

  const handleDeleteLayer = (id: string) => {
    if (textLayers.length <= 1) {
      showNotification('Cannot delete the last remaining text element.');
      return;
    }
    setTextLayers((prev) => prev.filter((l) => l.id !== id));
    if (selectedLayerId === id) {
      const remaining = textLayers.filter((l) => l.id !== id);
      setSelectedLayerId(remaining[0]?.id || null);
    }
    pushState();
    showNotification('Deleted text layer');
  };

  const handleMoveLayerZ = (id: string, direction: 'up' | 'down' | 'front' | 'back') => {
    setTextLayers((prev) => {
      const copy = [...prev];
      const targetIndex = copy.findIndex((l) => l.id === id);
      if (targetIndex === -1) return prev;

      if (direction === 'up' && targetIndex < copy.length - 1) {
        const temp = copy[targetIndex].zIndex;
        copy[targetIndex].zIndex = copy[targetIndex + 1].zIndex;
        copy[targetIndex + 1].zIndex = temp;
      } else if (direction === 'down' && targetIndex > 0) {
        const temp = copy[targetIndex].zIndex;
        copy[targetIndex].zIndex = copy[targetIndex - 1].zIndex;
        copy[targetIndex - 1].zIndex = temp;
      } else if (direction === 'front') {
        const maxZ = Math.max(...copy.map((l) => l.zIndex), 0);
        copy[targetIndex].zIndex = maxZ + 1;
      } else if (direction === 'back') {
        const minZ = Math.min(...copy.map((l) => l.zIndex), 0);
        copy[targetIndex].zIndex = Math.max(1, minZ - 1);
      }
      return copy;
    });
    pushState();
  };

  // ---------------------------------------------------------------------------
  // Canvas Interactive Drag & Placement Handlers
  // ---------------------------------------------------------------------------
  const handleLayerMouseDown = (e: React.MouseEvent, layer: PinTextLayer) => {
    if (layer.isLocked) return;
    e.stopPropagation();
    setSelectedLayerId(layer.id);
    setDraggingLayerId(layer.id);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setLayerInitialPos({ x: layer.x, y: layer.y });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggingLayerId || !dragStartPos || !layerInitialPos || !canvasContainerRef.current) return;

    const rect = canvasContainerRef.current.getBoundingClientRect();
    const deltaXPercent = ((e.clientX - dragStartPos.x) / rect.width) * 100;
    const deltaYPercent = ((e.clientY - dragStartPos.y) / rect.height) * 100;

    // Automatically prevent text from being dragged outside canvas bounds
    const newX = Math.max(2, Math.min(92, layerInitialPos.x + deltaXPercent));
    const newY = Math.max(2, Math.min(94, layerInitialPos.y + deltaYPercent));

    handleUpdateLayer(draggingLayerId, { x: Math.round(newX * 10) / 10, y: Math.round(newY * 10) / 10 });
  };

  const handleCanvasMouseUp = () => {
    if (draggingLayerId) {
      setDraggingLayerId(null);
      setDragStartPos(null);
      setLayerInitialPos(null);
      pushState();
    }
  };

  // ---------------------------------------------------------------------------
  // Background Image Upload & Handlers
  // ---------------------------------------------------------------------------
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      showNotification('Unsupported format. Please upload JPG, PNG, or WebP.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      showNotification('File exceeds 20MB. Please use an optimized image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setBackgroundConfig((prev) => ({
        ...prev,
        type: 'image_upload',
        imageUrl: dataUrl,
      }));
      pushState();
      showNotification(`Loaded background image: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('mp4') && !file.type.includes('webm')) {
      showNotification('Please upload an MP4 or WebM video file.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      showNotification('Video file exceeds 50MB limit.');
      return;
    }

    const url = URL.createObjectURL(file);
    setBackgroundConfig((prev) => ({
      ...prev,
      type: 'video_upload',
      videoUrl: url,
    }));
    setExportFormat('mp4');
    pushState();
    showNotification('Video background loaded! Export format set to MP4.');
  };

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const handleCaptureFrameAsPoster = () => {
    if (!videoRef.current) return;
    try {
      const vid = videoRef.current;
      const offCanvas = document.createElement('canvas');
      offCanvas.width = vid.videoWidth || 800;
      offCanvas.height = vid.videoHeight || 1200;
      const offCtx = offCanvas.getContext('2d');
      if (offCtx) {
        offCtx.drawImage(vid, 0, 0, offCanvas.width, offCanvas.height);
        const posterData = offCanvas.toDataURL('image/jpeg', 0.85);
        setBackgroundConfig((prev) => ({ ...prev, videoPosterUrl: posterData }));
        showNotification('Captured current frame as video poster thumbnail!');
      }
    } catch {
      showNotification('Could not capture frame due to video security restrictions.');
    }
  };

  // ---------------------------------------------------------------------------
  // Canvas Compositor: Pixel-Perfect Direct 2D Rendering Engine
  // PRE-RENDERS all assets, fonts, layers, and geometry BEFORE frame capture.
  // Static elements remain 100% pixel-stable without flicker, layout shift, or
  // repeated image instantiation during video or image rendering.
  // ---------------------------------------------------------------------------

  interface PreparedComposition {
    bgCanvas: HTMLCanvasElement | null;
    staticLayersCanvas: HTMLCanvasElement;
    masterStaticCanvas: HTMLCanvasElement | null;
    isVideoBackground: boolean;
    videoElement: HTMLVideoElement | null;
    videoMetrics: {
      drawX: number;
      drawY: number;
      drawW: number;
      drawH: number;
    };
  }

  const prepareCompositionAssets = async (
    width: number,
    height: number,
    captureVideoCurrentFrame = false
  ): Promise<PreparedComposition> => {
    // 1. Ensure all custom and web fonts are fully loaded and raster-ready
    if ('fonts' in document) {
      await document.fonts.ready;
    }

    const isVideo =
      (backgroundConfig.type === 'video_upload' ||
        backgroundConfig.type === 'video_library' ||
        backgroundConfig.type === 'video_url') &&
      !!backgroundConfig.videoUrl;

    let bgCanvas: HTMLCanvasElement | null = null;
    const videoMetrics = { drawX: 0, drawY: 0, drawW: width, drawH: height };
    const vidEl = videoRef.current;

    if (isVideo && !captureVideoCurrentFrame && vidEl) {
      // Calculate video metrics once
      const vidRatio = (vidEl.videoWidth || 16) / (vidEl.videoHeight || 9);
      const canvasRatio = width / height;
      let drawW = width;
      let drawH = height;
      let drawX = 0;
      let drawY = 0;

      if (backgroundConfig.videoFit === 'cover') {
        if (vidRatio > canvasRatio) {
          drawH = height;
          drawW = height * vidRatio;
          drawX = (width - drawW) * (backgroundConfig.position.x / 100);
        } else {
          drawW = width;
          drawH = width / vidRatio;
          drawY = (height - drawH) * (backgroundConfig.position.y / 100);
        }
      }

      if (backgroundConfig.zoom > 1.0) {
        drawW *= backgroundConfig.zoom;
        drawH *= backgroundConfig.zoom;
        drawX = (width - drawW) * (backgroundConfig.position.x / 100);
        drawY = (height - drawH) * (backgroundConfig.position.y / 100);
      }

      videoMetrics.drawX = Math.round(drawX);
      videoMetrics.drawY = Math.round(drawY);
      videoMetrics.drawW = Math.round(drawW);
      videoMetrics.drawH = Math.round(drawH);
    } else {
      // Pre-render static background onto bgCanvas once
      bgCanvas = document.createElement('canvas');
      bgCanvas.width = width;
      bgCanvas.height = height;
      const bgCtx = bgCanvas.getContext('2d');
      if (!bgCtx) throw new Error('Could not create background canvas context.');

      if (backgroundConfig.type === 'solid') {
        bgCtx.fillStyle = backgroundConfig.color || '#1E3A8A';
        bgCtx.fillRect(0, 0, width, height);
      } else if (backgroundConfig.type === 'gradient') {
        const grad = bgCtx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, backgroundConfig.gradient.from || '#1E3A8A');
        grad.addColorStop(1, backgroundConfig.gradient.to || '#0F172A');
        bgCtx.fillStyle = grad;
        bgCtx.fillRect(0, 0, width, height);
      } else if (isVideo && captureVideoCurrentFrame && vidEl && vidEl.readyState >= 2) {
        try {
          const vidRatio = (vidEl.videoWidth || 16) / (vidEl.videoHeight || 9);
          const canvasRatio = width / height;
          let drawW = width;
          let drawH = height;
          let drawX = 0;
          let drawY = 0;

          if (backgroundConfig.videoFit === 'cover') {
            if (vidRatio > canvasRatio) {
              drawH = height;
              drawW = height * vidRatio;
              drawX = (width - drawW) * (backgroundConfig.position.x / 100);
            } else {
              drawW = width;
              drawH = width / vidRatio;
              drawY = (height - drawH) * (backgroundConfig.position.y / 100);
            }
          }

          if (backgroundConfig.zoom > 1.0) {
            drawW *= backgroundConfig.zoom;
            drawH *= backgroundConfig.zoom;
            drawX = (width - drawW) * (backgroundConfig.position.x / 100);
            drawY = (height - drawH) * (backgroundConfig.position.y / 100);
          }

          bgCtx.save();
          if (backgroundConfig.brightness !== 100 || backgroundConfig.contrast !== 100 || backgroundConfig.blur > 0) {
            bgCtx.filter = `brightness(${backgroundConfig.brightness}%) contrast(${backgroundConfig.contrast}%) blur(${backgroundConfig.blur}px)`;
          }
          bgCtx.drawImage(vidEl, drawX, drawY, drawW, drawH);
          bgCtx.restore();
        } catch (err) {
          console.warn('Video frame capture warning:', err);
          bgCtx.fillStyle = '#1E232A';
          bgCtx.fillRect(0, 0, width, height);
        }
      } else {
        // Pre-load and decode background image ONCE
        const rawImgUrl = backgroundConfig.imageUrl || MEDIA_LIBRARY_IMAGES[0].url;
        let safeImgUrl = rawImgUrl;
        if (rawImgUrl.startsWith('http') && !rawImgUrl.includes(window.location.host)) {
          safeImgUrl = `/api/proxy-image?url=${encodeURIComponent(rawImgUrl)}`;
        }

        await new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = async () => {
            try {
              if ('decode' in img) {
                try {
                  await img.decode();
                } catch {
                  // Ignore decode errors if image is already loaded
                }
              }

              const imgRatio = img.width / (img.height || 1);
              const canvasRatio = width / height;
              let drawW = width;
              let drawH = height;
              let drawX = 0;
              let drawY = 0;

              if (backgroundConfig.imageFit === 'cover') {
                if (imgRatio > canvasRatio) {
                  drawH = height;
                  drawW = height * imgRatio;
                  drawX = (width - drawW) * (backgroundConfig.position.x / 100);
                } else {
                  drawW = width;
                  drawH = width / imgRatio;
                  drawY = (height - drawH) * (backgroundConfig.position.y / 100);
                }
              } else if (backgroundConfig.imageFit === 'contain') {
                if (imgRatio > canvasRatio) {
                  drawW = width;
                  drawH = width / imgRatio;
                  drawY = (height - drawH) / 2;
                } else {
                  drawH = height;
                  drawW = height * imgRatio;
                  drawX = (width - drawW) / 2;
                }
              }

              if (backgroundConfig.zoom > 1.0) {
                const zoomFactor = backgroundConfig.zoom;
                drawW *= zoomFactor;
                drawH *= zoomFactor;
                drawX = (width - drawW) * (backgroundConfig.position.x / 100);
                drawY = (height - drawH) * (backgroundConfig.position.y / 100);
              }

              bgCtx.save();
              bgCtx.globalAlpha = backgroundConfig.opacity / 100;
              if (backgroundConfig.brightness !== 100 || backgroundConfig.contrast !== 100 || backgroundConfig.blur > 0) {
                bgCtx.filter = `brightness(${backgroundConfig.brightness}%) contrast(${backgroundConfig.contrast}%) blur(${backgroundConfig.blur}px)`;
              }
              bgCtx.drawImage(img, Math.round(drawX), Math.round(drawY), Math.round(drawW), Math.round(drawH));
              bgCtx.restore();
              resolve();
            } catch {
              resolve();
            }
          };
          img.onerror = () => {
            bgCtx.fillStyle = '#1E3A8A';
            bgCtx.fillRect(0, 0, width, height);
            resolve();
          };
          img.src = safeImgUrl;
        });
      }

      // Draw dark background overlay ONCE
      bgCtx.save();
      if (backgroundConfig.overlayType === 'gradient') {
        const overlayGrad = bgCtx.createLinearGradient(0, 0, 0, height);
        overlayGrad.addColorStop(0, 'rgba(0,0,0,0.15)');
        overlayGrad.addColorStop(0.5, 'rgba(0,0,0,0.4)');
        overlayGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
        bgCtx.fillStyle = overlayGrad;
      } else {
        bgCtx.fillStyle = backgroundConfig.overlayColor || '#000000';
      }
      bgCtx.globalAlpha = (backgroundConfig.overlayOpacity || 35) / 100;
      bgCtx.fillRect(0, 0, width, height);
      bgCtx.restore();
    }

    // 2. Pre-render All Static Text Layers ONCE onto an offscreen canvas
    const staticLayersCanvas = document.createElement('canvas');
    staticLayersCanvas.width = width;
    staticLayersCanvas.height = height;
    const layerCtx = staticLayersCanvas.getContext('2d');
    if (!layerCtx) throw new Error('Could not create static layers canvas context.');

    const scale = width / 1000;
    const sortedLayers = [...textLayers].sort((a, b) => a.zIndex - b.zIndex);

    // Preload all fonts and weights required by text layers before canvas operations
    try {
      if ('fonts' in document) {
        await (document as any).fonts.ready;
        await Promise.all(
          sortedLayers.map(async (layer) => {
            if (!layer.text) return;
            const weight = layer.fontWeight || '400';
            const style = layer.fontStyle === 'italic' ? 'italic' : 'normal';
            const cleanFamily = layer.fontFamily.replace(/['"]/g, '').split(',')[0].trim();
            try {
              await Promise.all([
                (document as any).fonts.load(`${style} ${weight} 32px "${cleanFamily}"`),
                (document as any).fonts.load(`${style} ${weight} 32px ${layer.fontFamily}`),
              ]);
            } catch {
              // Ignore individual font preload fallbacks
            }
          })
        );
      }
    } catch (fontErr) {
      console.warn('Font readiness verification notice:', fontErr);
    }

    for (const layer of sortedLayers) {
      if (!layer.text) continue;

      layerCtx.save();

      const posX = Math.round((layer.x / 100) * width);
      const posY = Math.round((layer.y / 100) * height);
      const scaledFontSize = Math.max(8, Math.round(layer.fontSize * scale));

      layerCtx.translate(posX, posY);
      if (layer.rotation) {
        layerCtx.rotate((layer.rotation * Math.PI) / 180);
      }

      const fontStyle = layer.fontStyle === 'italic' ? 'italic ' : '';
      const fontWeight = layer.fontWeight || '400';
      const cleanFamily = layer.fontFamily.replace(/['"]/g, '').split(',')[0].trim();

      // Configure font with exact weight, size in export canvas pixels, and family
      layerCtx.font = `${fontStyle}${fontWeight} ${scaledFontSize}px "${cleanFamily}", ${layer.fontFamily}`;

      // Check if context accepted font declaration; if not fallback cleanly
      if (layerCtx.font === '10px sans-serif' || !layerCtx.font.includes(String(scaledFontSize))) {
        layerCtx.font = `${fontStyle}${fontWeight} ${scaledFontSize}px "${cleanFamily}", sans-serif`;
      }

      // Apply letter spacing if supported by 2D canvas context
      if ('letterSpacing' in layerCtx && layer.letterSpacing !== undefined) {
        (layerCtx as any).letterSpacing = `${Math.round((layer.letterSpacing || 0) * scale)}px`;
      }

      let renderedText = layer.text;
      if (layer.textTransform === 'uppercase') renderedText = renderedText.toUpperCase();
      if (layer.textTransform === 'lowercase') renderedText = renderedText.toLowerCase();
      if (layer.textTransform === 'capitalize') {
        renderedText = renderedText.replace(/\b\w/g, (c) => c.toUpperCase());
      }

      const hasBg = !!layer.hasBackground;
      const padX = hasBg ? Math.round((layer.backgroundPaddingX ?? 14) * scale) : 0;
      const padY = hasBg ? Math.round((layer.backgroundPaddingY ?? 6) * scale) : 0;
      const radius = hasBg ? Math.round((layer.backgroundRadius ?? 20) * scale) : 0;

      // Available maximum wrapping width inside the container (subtract horizontal padding if background is enabled)
      const maxWrapWidth = Math.max(
        40,
        (layer.width ? (layer.width / 100) * width : width * 0.85) - padX * 2
      );

      const rawLines = renderedText.split('\n');
      const lines: string[] = [];

      for (const rawLine of rawLines) {
        if (!rawLine.trim()) {
          lines.push('');
          continue;
        }
        const words = rawLine.split(' ');
        let currentLine = words[0] || '';
        for (let i = 1; i < words.length; i++) {
          const test = currentLine + ' ' + words[i];
          if (layerCtx.measureText(test).width > maxWrapWidth) {
            lines.push(currentLine);
            currentLine = words[i];
          } else {
            currentLine = test;
          }
        }
        lines.push(currentLine);
      }

      const lineHeight = Math.round(scaledFontSize * (layer.lineHeight || 1.25));
      const totalBlockHeight = lines.length * lineHeight;

      const measuredWidths = lines.map((l) => (l ? layerCtx.measureText(l).width : 0));
      const maxLineWidth = lines.length > 0 ? Math.max(...measuredWidths, 0) : 0;

      // Container width matches the preview container:
      // If layer.width is explicitly set (e.g. 80%), use that exact canvas percentage width.
      // If layer.width is not set (e.g. CTA button pill, badge), shrink-wrap to content plus padding.
      const contentWidth = layer.width
        ? (layer.width / 100) * width
        : maxLineWidth + padX * 2;
      const contentHeight = totalBlockHeight + padY * 2;

      // Background highlight / pill
      if (hasBg) {
        layerCtx.save();
        layerCtx.fillStyle = layer.backgroundColor || '#FBBF24';
        layerCtx.globalAlpha = ((layer.backgroundOpacity ?? 100) / 100) * ((layer.opacity ?? 100) / 100);

        layerCtx.beginPath();
        layerCtx.roundRect(0, 0, Math.round(contentWidth), Math.round(contentHeight), radius);
        layerCtx.fill();
        layerCtx.restore();
      }

      // Drop shadow
      if (layer.hasShadow) {
        layerCtx.shadowColor = layer.shadowColor || 'rgba(0,0,0,0.7)';
        layerCtx.shadowBlur = Math.round((layer.shadowBlur ?? 8) * scale);
        layerCtx.shadowOffsetX = Math.round((layer.shadowOffsetX ?? 0) * scale);
        layerCtx.shadowOffsetY = Math.round((layer.shadowOffsetY ?? 3) * scale);
      }

      // Stroke / outline
      if (layer.hasOutline) {
        layerCtx.strokeStyle = layer.outlineColor || '#000000';
        layerCtx.lineWidth = Math.round((layer.outlineWidth ?? 2) * scale);
      }

      // Text fill style
      if (layer.isGradientText && layer.textGradient) {
        const textGrad = layerCtx.createLinearGradient(0, 0, contentWidth, 0);
        textGrad.addColorStop(0, layer.textGradient.from || layer.color);
        textGrad.addColorStop(1, layer.textGradient.to || '#FBBF24');
        layerCtx.fillStyle = textGrad;
      } else {
        layerCtx.fillStyle = layer.color || '#FFFFFF';
      }

      layerCtx.globalAlpha = (layer.opacity ?? 100) / 100;
      layerCtx.textBaseline = 'top';

      let drawX: number;
      if (layer.textAlign === 'center') {
        layerCtx.textAlign = 'center';
        drawX = contentWidth / 2;
      } else if (layer.textAlign === 'right') {
        layerCtx.textAlign = 'right';
        drawX = contentWidth - padX;
      } else {
        layerCtx.textAlign = 'left';
        drawX = padX;
      }

      lines.forEach((lineText, idx) => {
        if (!lineText) return;
        const lineY = padY + idx * lineHeight;
        if (layer.hasOutline) {
          layerCtx.strokeText(lineText, drawX, lineY);
        }
        layerCtx.fillText(lineText, drawX, lineY);
      });

      layerCtx.restore();
    }

    // 3. If NOT video background, composite bg + staticLayers into masterStaticCanvas once
    let masterStaticCanvas: HTMLCanvasElement | null = null;
    if (bgCanvas) {
      masterStaticCanvas = document.createElement('canvas');
      masterStaticCanvas.width = width;
      masterStaticCanvas.height = height;
      const masterCtx = masterStaticCanvas.getContext('2d');
      if (masterCtx) {
        masterCtx.drawImage(bgCanvas, 0, 0);
        masterCtx.drawImage(staticLayersCanvas, 0, 0);
      }
    }

    return {
      bgCanvas,
      staticLayersCanvas,
      masterStaticCanvas,
      isVideoBackground: isVideo && !captureVideoCurrentFrame,
      videoElement: vidEl,
      videoMetrics,
    };
  };

  // ---------------------------------------------------------------------------
  // Real High-Resolution Export Handler with Audio Synchronization
  // ---------------------------------------------------------------------------
  const handleExecuteExport = async () => {
    setIsExporting(true);
    setExportProgress(10);
    setExportError(null);

    const safeTitle = (textLayers.find((l) => l.presetType === 'headline')?.text || 'pin')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .substring(0, 35);
    const filename = `pinterest-${sizePreset}-pin-${safeTitle}.${exportFormat === 'mp4' ? 'mp4' : exportFormat}`;

    try {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvasWidth;
      exportCanvas.height = canvasHeight;
      const exportCtx = exportCanvas.getContext('2d');
      if (!exportCtx) throw new Error('Failed to acquire 2D canvas context for export.');

      if (exportFormat === 'png' || exportFormat === 'jpg') {
        setExportProgress(25);
        // Preload and bake everything once
        const prepared = await prepareCompositionAssets(canvasWidth, canvasHeight, true);
        setExportProgress(70);

        if (prepared.masterStaticCanvas) {
          exportCtx.drawImage(prepared.masterStaticCanvas, 0, 0);
        } else if (prepared.bgCanvas) {
          exportCtx.drawImage(prepared.bgCanvas, 0, 0);
          exportCtx.drawImage(prepared.staticLayersCanvas, 0, 0);
        }

        const mimeType = exportFormat === 'png' ? 'image/png' : 'image/jpeg';
        const quality = exportFormat === 'png' ? 1.0 : 0.95;

        const blob = await new Promise<Blob | null>((resolve) => {
          exportCanvas.toBlob((b) => resolve(b), mimeType, quality);
        });

        if (!blob || blob.size === 0) {
          throw new Error('Canvas blob generation produced an empty file. Check browser memory.');
        }

        setExportProgress(90);

        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setExportProgress(100);
        showNotification(
          `Exported high-res ${canvasWidth} × ${canvasHeight}px ${exportFormat.toUpperCase()} successfully!`
        );
      } else {
        // Video Pin Export with Pre-Rendered Pixel-Stable Layers & Audio Synchronization
        setExportProgress(15);

        if (typeof MediaRecorder === 'undefined') {
          throw new Error('MediaRecorder video encoding is not supported in this browser.');
        }

        // 1. Prepare and pre-render all static assets and typography ONCE before starting video stream
        const prepared = await prepareCompositionAssets(canvasWidth, canvasHeight, false);
        setExportProgress(30);

        const supportedTypes = [
          'video/mp4;codecs=avc1,mp4a.40.2',
          'video/mp4;codecs=avc1',
          'video/mp4',
          'video/webm;codecs=vp9,opus',
          'video/webm;codecs=vp8,opus',
          'video/webm;codecs=h264,opus',
          'video/webm',
        ];
        let chosenMime = 'video/webm';
        for (const type of supportedTypes) {
          if (MediaRecorder.isTypeSupported(type)) {
            chosenMime = type;
            break;
          }
        }

        // Draw initial deterministic frame
        if (prepared.masterStaticCanvas) {
          exportCtx.drawImage(prepared.masterStaticCanvas, 0, 0);
        } else {
          if (prepared.videoElement) {
            exportCtx.drawImage(
              prepared.videoElement,
              prepared.videoMetrics.drawX,
              prepared.videoMetrics.drawY,
              prepared.videoMetrics.drawW,
              prepared.videoMetrics.drawH
            );
          }
          exportCtx.drawImage(prepared.staticLayersCanvas, 0, 0);
        }

        const rawVideoStream = exportCanvas.captureStream(30);

        // Mix Audio into Stream: Handles added soundtrack, voice narration, and background video sound
        const mixed = await mixAudioIntoVideoStream(rawVideoStream, {
          audioUrl:
            audioConfig.sourceType !== 'none' && !audioConfig.isMuted
              ? audioConfig.audioUrl
              : undefined,
          volume: audioConfig.volume,
          isMuted: audioConfig.isMuted,
          startTime: audioConfig.startTime,
          loop: audioConfig.loop !== false,
          trackId: audioConfig.trackId,
          videoElement:
            prepared.isVideoBackground && !backgroundConfig.videoMuted
              ? prepared.videoElement
              : null,
          videoMuted: backgroundConfig.videoMuted,
          videoVolume: audioConfig.originalVideoVolume ?? 80,
        });

        const streamToRecord = mixed.stream;
        const audioCleanup = mixed.cleanup;
        const hasAudibleAudio = mixed.hasAudibleAudio;

        const recordedChunks: Blob[] = [];
        const mediaRecorder = new MediaRecorder(streamToRecord, { mimeType: chosenMime });

        mediaRecorder.ondataavailable = (evt) => {
          if (evt.data && evt.data.size > 0) {
            recordedChunks.push(evt.data);
          }
        };

        const durationMs = 5000;
        const startTime = Date.now();

        // If background is video, sync video playback from trim start
        if (prepared.isVideoBackground && prepared.videoElement) {
          try {
            prepared.videoElement.currentTime = backgroundConfig.videoTrimStart || 0;
            prepared.videoElement.play().catch(() => {});
          } catch {
            // Ignore playback restrictions
          }
        }

        mediaRecorder.onstop = () => {
          audioCleanup();
          const isMp4 = chosenMime.includes('mp4');
          const ext = isMp4 ? 'mp4' : 'webm';
          const finalFilename = `pinterest-${sizePreset}-pin-${safeTitle}.${ext}`;

          const videoBlob = new Blob(recordedChunks, {
            type: isMp4 ? 'video/mp4' : 'video/webm',
          });

          if (!videoBlob || videoBlob.size === 0) {
            setExportError('Video encoding generated an empty file. Check browser memory.');
            setIsExporting(false);
            return;
          }

          const videoUrl = URL.createObjectURL(videoBlob);
          const link = document.createElement('a');
          link.href = videoUrl;
          link.download = finalFilename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setExportProgress(100);
          showNotification(
            hasAudibleAudio
              ? `Exported Video Pin with audio (${canvasWidth} × ${canvasHeight}px, ${ext.toUpperCase()})!`
              : `Exported Video Pin (${canvasWidth} × ${canvasHeight}px, ${ext.toUpperCase()})!`
          );
          setIsExporting(false);
        };

        mediaRecorder.start();

        // Ultra-stable deterministic frame render loop
        // ZERO image instantiations, ZERO font recalculations, ZERO layout shifting!
        const renderFrameLoop = () => {
          const elapsed = Date.now() - startTime;
          const pct = Math.min(95, Math.floor(30 + (elapsed / durationMs) * 65));
          setExportProgress(pct);

          if (prepared.masterStaticCanvas) {
            // Static background: Draw pre-rendered pixel-perfect canvas
            exportCtx.drawImage(prepared.masterStaticCanvas, 0, 0);
          } else if (prepared.isVideoBackground && prepared.videoElement) {
            // Video background: Draw video frame with pre-computed geometry
            exportCtx.save();
            if (backgroundConfig.brightness !== 100 || backgroundConfig.contrast !== 100 || backgroundConfig.blur > 0) {
              exportCtx.filter = `brightness(${backgroundConfig.brightness}%) contrast(${backgroundConfig.contrast}%) blur(${backgroundConfig.blur}px)`;
            }
            exportCtx.drawImage(
              prepared.videoElement,
              prepared.videoMetrics.drawX,
              prepared.videoMetrics.drawY,
              prepared.videoMetrics.drawW,
              prepared.videoMetrics.drawH
            );
            exportCtx.restore();

            // Draw pre-calculated overlay
            exportCtx.save();
            if (backgroundConfig.overlayType === 'gradient') {
              const overlayGrad = exportCtx.createLinearGradient(0, 0, 0, canvasHeight);
              overlayGrad.addColorStop(0, 'rgba(0,0,0,0.15)');
              overlayGrad.addColorStop(0.5, 'rgba(0,0,0,0.4)');
              overlayGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
              exportCtx.fillStyle = overlayGrad;
            } else {
              exportCtx.fillStyle = backgroundConfig.overlayColor || '#000000';
            }
            exportCtx.globalAlpha = (backgroundConfig.overlayOpacity || 35) / 100;
            exportCtx.fillRect(0, 0, canvasWidth, canvasHeight);
            exportCtx.restore();

            // Draw pre-rendered static text and badges overlay directly on top!
            exportCtx.drawImage(prepared.staticLayersCanvas, 0, 0);
          }

          if (elapsed < durationMs) {
            requestAnimationFrame(renderFrameLoop);
          } else {
            mediaRecorder.stop();
          }
        };

        requestAnimationFrame(renderFrameLoop);
        return;
      }
    } catch (err: any) {
      console.error('Export Error:', err);
      setExportError(err.message || 'Failed to export Pin composition.');
      showNotification('Export encountered an issue. See diagnostic message.');
    } finally {
      if (exportFormat !== 'mp4') {
        setIsExporting(false);
      }
    }
  };

  // Alternative DOM Snapshot Export
  const handleExecuteDomSnapshotExport = async () => {
    if (!canvasContainerRef.current) return;
    setIsExporting(true);
    setExportProgress(20);
    setExportError(null);

    const safeTitle = 'pin';
    const filename = `pinterest-${sizePreset}-pin-dom.${exportFormat === 'mp4' ? 'png' : exportFormat}`;

    try {
      const node = canvasContainerRef.current;
      const currentWidth = node.clientWidth;
      const scale = canvasWidth / currentWidth;

      setExportProgress(50);
      const options = {
        width: canvasWidth,
        height: canvasHeight,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${currentWidth}px`,
          height: `${canvasHeight / scale}px`,
        },
        pixelRatio: 1,
        quality: 0.95,
      };

      let dataUrl = '';
      if (exportFormat === 'jpg') {
        dataUrl = await toJpeg(node, { ...options, backgroundColor: '#FFFFFF' });
      } else {
        dataUrl = await toPng(node, options);
      }

      setExportProgress(90);
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportProgress(100);
      showNotification(`Exported DOM Snapshot (${canvasWidth} × ${canvasHeight}px)!`);
    } catch (err: any) {
      setExportError(`DOM Snapshot error: ${err.message}. Retrying with Canvas Compositor...`);
      await handleExecuteExport();
    } finally {
      setIsExporting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Inline Gemini AI Assistant Handler
  // ---------------------------------------------------------------------------
  const handleGenerateAiPinContent = async () => {
    setAiAssistantLoading(true);
    setAiAssistantOutput(null);
    try {
      const headlineText = textLayers.find((l) => l.presetType === 'headline')?.text;
      const topicToUse = aiAssistantPrompt || headlineText || 'How to monetise digital products on Pinterest';
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicToUse,
          actionType: aiAssistantTask,
          targetAudience: 'Content creators, designers, and digital product sellers',
          tone: 'Authoritative, viral, and actionable',
          brandName: 'VeritasCraft',
        }),
      });

      const data = await response.json();
      if (data.success && data.result) {
        setAiAssistantOutput(data.result);
        showNotification('Gemini 3.8 Flash generated new Pin copy!');
      } else {
        showNotification(data.message || data.error || 'Failed to generate content.');
      }
    } catch {
      showNotification('AI server request failed.');
    } finally {
      setAiAssistantLoading(false);
    }
  };

  const handleApplyAiLineToHeadline = (line: string) => {
    const cleanLine = line.replace(/^[0-9]+[\.\)]\s*/, '').replace(/["*#]/g, '').trim();
    setTextLayers((prev) =>
      prev.map((l) => (l.presetType === 'headline' ? { ...l, text: cleanLine } : l))
    );
    setPinTitle(cleanLine);
    pushState();
    showNotification('Applied AI headline to Pin canvas!');
  };

  const getAspectRatioStyle = () => {
    if (sizePreset === 'custom') {
      return { aspectRatio: `${canvasWidth} / ${canvasHeight}` };
    }
    const currentPreset = PIN_SIZE_PRESETS.find((p) => p.id === sizePreset);
    return { aspectRatio: `${currentPreset?.width || 1000} / ${currentPreset?.height || 1500}` };
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--theme-border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase bg-rose-600 text-white px-2 py-0.5 rounded font-bold">
              Pinterest Studio Pro
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Canvas: {canvasWidth} × {canvasHeight} px ({PIN_SIZE_PRESETS.find((p) => p.id === sizePreset)?.ratioLabel})
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 mt-1">
            Pin Design & Video Rendering Engine
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-30 text-slate-700 transition-colors cursor-pointer"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-30 text-slate-700 transition-colors cursor-pointer"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('ai_assistant')}
            className="px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Pin Copy
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" /> Export Pin
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Controls Accordion & Tabs */}
        <div className="lg:col-span-7 bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] p-6 shadow-xs space-y-6">
          {/* Tool Navigation Bar */}
          <div className="flex border-b border-[var(--theme-border)] gap-2 pb-3 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'size', label: 'Canvas Size', icon: Maximize2 },
              { id: 'background', label: 'Background & Media', icon: ImageIcon },
              { id: 'text_settings', label: 'Text Design', icon: Type },
              { id: 'audio', label: 'Music & Audio', icon: Music },
              { id: 'metadata', label: 'SEO & Destination', icon: ExternalLink },
              { id: 'ai_assistant', label: 'AI Writing', icon: Sparkles },
              { id: 'export', label: 'Export & Download', icon: Download },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[var(--theme-primary)] text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: CANVAS SIZE */}
          {activeTab === 'size' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">Select Pin Size & Aspect Ratio</h3>
                <p className="text-xs text-slate-500">
                  Switch sizes anytime. All text elements adapt placement intelligently without erasing content.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PIN_SIZE_PRESETS.filter((p) => p.id !== 'custom').map((preset) => {
                  const isSelected = sizePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectSizePreset(preset.id)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-serif font-bold text-sm text-slate-900">{preset.label}</span>
                        <span className="font-mono text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">
                          {preset.ratioLabel}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-semibold text-slate-700 mb-1">
                        {preset.width} × {preset.height} px
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {preset.recommendation}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Custom Size Form */}
              <div className="pt-4 border-t border-[var(--theme-border)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-900">Custom Canvas Dimensions:</span>
                  <span className="text-[11px] text-slate-500 font-mono">Sensible limits: 400px to 3000px</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-600 font-mono mb-1">Width (px)</label>
                    <input
                      type="number"
                      min="400"
                      max="2400"
                      value={canvasWidth}
                      onChange={(e) => handleCustomDimensionsChange(Number(e.target.value), canvasHeight)}
                      className="w-full px-3 py-2 bg-slate-50 border rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-mono mb-1">Height (px)</label>
                    <input
                      type="number"
                      min="400"
                      max="3000"
                      value={canvasHeight}
                      onChange={(e) => handleCustomDimensionsChange(canvasWidth, Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border rounded font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BACKGROUND & MEDIA */}
          {activeTab === 'background' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">Background Type & Media</h3>
                <p className="text-xs text-slate-500">
                  Select solid color, dynamic gradient, upload custom image/video, or pick from our curated media library.
                </p>
              </div>

              {/* 8 Background Type Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium">
                {[
                  { id: 'solid', label: 'Solid Color' },
                  { id: 'gradient', label: 'Gradient' },
                  { id: 'image_upload', label: 'Upload Image' },
                  { id: 'image_library', label: 'Media Photos' },
                  { id: 'image_url', label: 'Image URL' },
                  { id: 'video_upload', label: 'Upload Video' },
                  { id: 'video_library', label: 'Media Videos' },
                  { id: 'video_url', label: 'Video URL' },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      setBackgroundConfig((prev) => ({ ...prev, type: bg.id as any }));
                      pushState();
                    }}
                    className={`py-2 px-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      backgroundConfig.type === bg.id
                        ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>

              {/* Solid Color */}
              {backgroundConfig.type === 'solid' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <label className="block text-slate-700 font-medium">Pick Solid Background Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={backgroundConfig.color}
                      onChange={(e) => setBackgroundConfig((prev) => ({ ...prev, color: e.target.value }))}
                      className="w-10 h-10 rounded cursor-pointer border"
                    />
                    <input
                      type="text"
                      value={backgroundConfig.color}
                      onChange={(e) => setBackgroundConfig((prev) => ({ ...prev, color: e.target.value }))}
                      className="px-3 py-2 bg-white border rounded font-mono text-xs flex-1"
                    />
                  </div>
                </div>
              )}

              {/* Gradient */}
              {backgroundConfig.type === 'gradient' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">From Color</label>
                      <input
                        type="color"
                        value={backgroundConfig.gradient.from}
                        onChange={(e) =>
                          setBackgroundConfig((prev) => ({
                            ...prev,
                            gradient: { ...prev.gradient, from: e.target.value },
                          }))
                        }
                        className="w-full h-8 rounded cursor-pointer border"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">To Color</label>
                      <input
                        type="color"
                        value={backgroundConfig.gradient.to}
                        onChange={(e) =>
                          setBackgroundConfig((prev) => ({
                            ...prev,
                            gradient: { ...prev.gradient, to: e.target.value },
                          }))
                        }
                        className="w-full h-8 rounded cursor-pointer border"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Image Upload */}
              {backgroundConfig.type === 'image_upload' && (
                <div className="p-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 text-center space-y-3">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="text-xs text-slate-600 font-medium">
                    Upload High-Resolution Pin Image (JPG, PNG, WebP)
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    onChange={handleImageUpload}
                    className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                  />
                </div>
              )}

              {/* Media Library Images */}
              {backgroundConfig.type === 'image_library' && (
                <div className="space-y-3 text-xs">
                  <label className="block font-medium text-slate-700">Select Media Library Photo</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {MEDIA_LIBRARY_IMAGES.map((img) => (
                      <div
                        key={img.id}
                        onClick={() => {
                          setBackgroundConfig((prev) => ({ ...prev, imageUrl: img.url }));
                          pushState();
                        }}
                        className={`p-2 rounded-lg border cursor-pointer transition-all ${
                          backgroundConfig.imageUrl === img.url
                            ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className="w-full h-16 rounded bg-slate-200 mb-1.5 bg-cover bg-center"
                          style={{ backgroundImage: `url(${img.url})` }}
                        />
                        <div className="font-semibold text-slate-900 text-[11px] truncate">{img.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Upload */}
              {backgroundConfig.type === 'video_upload' && (
                <div className="p-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 text-center space-y-3">
                  <FileVideo className="w-8 h-8 text-rose-500 mx-auto" />
                  <div className="text-xs text-slate-600 font-medium">
                    Upload Background Video (MP4 / WebM, max 50MB)
                  </div>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={handleVideoUpload}
                    className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-rose-600 file:text-white hover:file:bg-rose-700 cursor-pointer"
                  />
                </div>
              )}

              {/* Media Library Videos */}
              {backgroundConfig.type === 'video_library' && (
                <div className="space-y-3 text-xs">
                  <label className="block font-medium text-slate-700">Select Curated Looping Video Clip</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {MEDIA_LIBRARY_VIDEOS.map((vid) => (
                      <div
                        key={vid.id}
                        onClick={() => {
                          setBackgroundConfig((prev) => ({
                            ...prev,
                            videoUrl: vid.url,
                            videoPosterUrl: vid.poster,
                          }));
                          setExportFormat('mp4');
                          pushState();
                        }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          backgroundConfig.videoUrl === vid.url
                            ? 'border-rose-600 bg-rose-50/50 ring-2 ring-rose-500/20'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className="w-full h-20 rounded bg-slate-900 mb-2 bg-cover bg-center flex items-center justify-center text-white"
                          style={{ backgroundImage: `url(${vid.poster})` }}
                        >
                          <Play className="w-5 h-5 opacity-90" />
                        </div>
                        <div className="font-semibold text-slate-900 text-[11px] truncate">{vid.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Adjustments & Overlay */}
              <div className="pt-4 border-t border-[var(--theme-border)] space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    <span>Visual Fit, Focal Point & Filters</span>
                  </h4>
                  <button
                    onClick={() => {
                      setBackgroundConfig((prev) => ({
                        ...prev,
                        zoom: 1.0,
                        brightness: 100,
                        contrast: 100,
                        blur: 0,
                        position: { x: 50, y: 50 },
                      }));
                      pushState();
                      showNotification('Filters reset');
                    }}
                    className="text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 mb-1">Image Fit</label>
                    <select
                      value={backgroundConfig.imageFit}
                      onChange={(e) =>
                        setBackgroundConfig((prev) => ({ ...prev, imageFit: e.target.value as any }))
                      }
                      className="w-full px-3 py-1.5 bg-slate-50 border rounded text-xs"
                    >
                      <option value="cover">Cover (Fill & Crop)</option>
                      <option value="contain">Contain (Fit inside)</option>
                      <option value="fill">Fill (Stretch to fit)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">
                      Zoom ({Math.round(backgroundConfig.zoom * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="3.0"
                      step="0.05"
                      value={backgroundConfig.zoom}
                      onChange={(e) =>
                        setBackgroundConfig((prev) => ({ ...prev, zoom: Number(e.target.value) }))
                      }
                      className="w-full accent-blue-600"
                    />
                  </div>
                </div>

                {/* 9-Point Focal Point Grid */}
                <div>
                  <label className="block text-slate-600 mb-1.5">Focal Point Alignment:</label>
                  <div className="flex items-center gap-4">
                    <div className="grid grid-cols-3 gap-1 w-28 p-1 bg-slate-100 rounded-lg border border-slate-300">
                      {FOCAL_POINTS.map((fp) => (
                        <button
                          key={fp.id}
                          onClick={() => {
                            setBackgroundConfig((prev) => ({
                              ...prev,
                              position: { x: fp.x, y: fp.y },
                            }));
                            pushState();
                          }}
                          className={`py-1 text-[10px] font-mono rounded cursor-pointer transition-colors ${
                            backgroundConfig.position.x === fp.x && backgroundConfig.position.y === fp.y
                              ? 'bg-blue-600 text-white font-bold'
                              : 'bg-white hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {fp.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>X: {backgroundConfig.position.x}%</span>
                        <span>Y: {backgroundConfig.position.y}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={backgroundConfig.position.x}
                        onChange={(e) =>
                          setBackgroundConfig((prev) => ({
                            ...prev,
                            position: { ...prev.position, x: Number(e.target.value) },
                          }))
                        }
                        className="w-full accent-blue-600 h-1.5"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={backgroundConfig.position.y}
                        onChange={(e) =>
                          setBackgroundConfig((prev) => ({
                            ...prev,
                            position: { ...prev.position, y: Number(e.target.value) },
                          }))
                        }
                        className="w-full accent-blue-600 h-1.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Overlays */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Background Dark Overlay</span>
                    <span className="font-mono text-slate-600">{backgroundConfig.overlayOpacity}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-600 mb-1">Color</label>
                      <input
                        type="color"
                        value={backgroundConfig.overlayColor}
                        onChange={(e) =>
                          setBackgroundConfig((prev) => ({ ...prev, overlayColor: e.target.value }))
                        }
                        className="w-full h-8 rounded border cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Opacity</label>
                      <input
                        type="range"
                        min="0"
                        max="90"
                        value={backgroundConfig.overlayOpacity}
                        onChange={(e) =>
                          setBackgroundConfig((prev) => ({ ...prev, overlayOpacity: Number(e.target.value) }))
                        }
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEXT DESIGN SETTINGS PANEL (FULLY CUSTOMIZABLE) */}
          {activeTab === 'text_settings' && (
            <TextSettingsPanel
              layers={textLayers}
              selectedLayerId={selectedLayerId}
              onSelectLayer={(id) => setSelectedLayerId(id)}
              onUpdateLayer={handleUpdateLayer}
              onAddLayer={handleAddLayer}
              onDuplicateLayer={handleDuplicateLayer}
              onDeleteLayer={handleDeleteLayer}
              onMoveLayerZ={handleMoveLayerZ}
              showSafeMargins={showSafeMargins}
              onToggleSafeMargins={() => setShowSafeMargins(!showSafeMargins)}
              showGridGuides={showGridGuides}
              onToggleGridGuides={() => setShowGridGuides(!showGridGuides)}
              backgroundColor={backgroundConfig.color || '#1E3A8A'}
            />
          )}

          {/* TAB 4: MUSIC & AUDIO CONTROLS PANEL */}
          {activeTab === 'audio' && (
            <AudioSettingsPanel
              audioConfig={audioConfig}
              onChangeAudioConfig={(updates) => setAudioConfig((prev) => ({ ...prev, ...updates }))}
              showNotification={showNotification}
              backgroundConfig={backgroundConfig}
              onChangeBackgroundConfig={(updates) => setBackgroundConfig((prev) => ({ ...prev, ...updates }))}
            />
          )}

          {/* TAB 5: METADATA & SEO */}
          {activeTab === 'metadata' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Destination URL</label>
                <select
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded"
                >
                  <optgroup label="Editorial Blog Articles">
                    {blogPosts.map((b) => (
                      <option key={b.id} value={`/blog/${b.slug}`}>
                        {b.title}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Digital Products & Systems">
                    {products.map((p) => (
                      <option key={p.id} value={`/product/${p.slug}`}>
                        {p.name} (${p.price})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Board Name</label>
                <input
                  type="text"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pin Title (Search SEO)</label>
                <input
                  type="text"
                  value={pinTitle}
                  onChange={(e) => setPinTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">SEO Pin Description</label>
                <textarea
                  rows={3}
                  value={pinDescription}
                  onChange={(e) => setPinDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded"
                />
              </div>
            </div>
          )}

          {/* TAB 6: AI WRITING ASSISTANT */}
          {activeTab === 'ai_assistant' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold w-fit">
                <Sparkles className="w-3.5 h-3.5" /> GEMINI 3.8 FLASH CONTENT ENGINE
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Topic / Product Idea</label>
                <input
                  type="text"
                  value={aiAssistantPrompt}
                  onChange={(e) => setAiAssistantPrompt(e.target.value)}
                  placeholder="e.g. How to Build a 6-Figure Notion Template Store"
                  className="w-full px-3 py-2 bg-slate-50 border rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'pin_title', label: '10 High-CTR Titles' },
                  { id: 'pin_description', label: 'SEO Description' },
                  { id: 'pin_keywords', label: 'Keyword Research' },
                  { id: 'pin_hashtags', label: 'Hashtag Sets' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setAiAssistantTask(t.id as any)}
                    className={`p-2 rounded-lg border text-center font-medium cursor-pointer ${
                      aiAssistantTask === t.id
                        ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerateAiPinContent}
                disabled={aiAssistantLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {aiAssistantLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Gemini is drafting copy...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Copy with Gemini</span>
                  </>
                )}
              </button>

              {aiAssistantOutput && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 pb-2 border-b">
                    <span>Generated Suggestions (Click any line to apply):</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiAssistantOutput);
                        showNotification('Copied AI text to clipboard!');
                      }}
                      className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" /> Copy All
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-60 overflow-y-auto">
                    {aiAssistantOutput
                      .split('\n')
                      .filter((l) => l.trim().length > 0)
                      .map((line, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleApplyAiLineToHeadline(line)}
                          className="p-2 bg-white rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 cursor-pointer text-[11px] text-slate-800 transition-colors flex items-center justify-between gap-2"
                        >
                          <span className="truncate">{line}</span>
                          <span className="text-[10px] text-blue-600 shrink-0 font-medium">Use →</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: EXPORT & DOWNLOAD */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">Export High-Resolution Pin</h3>
                <p className="text-xs text-slate-500">
                  Generate verified full-resolution files ({canvasWidth} × {canvasHeight} px) with composited typography and audio.
                </p>
              </div>

              {/* Format Selector */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'png', label: 'PNG (Lossless Raster)', ext: '.png', icon: FileImage },
                  { id: 'jpg', label: 'JPEG (High Quality)', ext: '.jpg', icon: FileImage },
                  { id: 'mp4', label: 'Video (Playable MP4)', ext: '.mp4', icon: FileVideo },
                ].map((fmt) => {
                  const Icon = fmt.icon;
                  const isSelected = exportFormat === fmt.id;
                  return (
                    <button
                      key={fmt.id}
                      onClick={() => setExportFormat(fmt.id as any)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-slate-700 mb-1" />
                      <div className="font-bold text-xs text-slate-900">{fmt.label}</div>
                      <div className="text-[10px] font-mono text-slate-500">{fmt.ext}</div>
                    </button>
                  );
                })}
              </div>

              {/* Rendering Pipeline Option */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">Rendering Pipeline</span>
                  <span className="text-[11px] text-slate-500">
                    {exportEngine === 'compositor'
                      ? 'Canvas Compositor (Exact pixel resolution, CORS-proof)'
                      : 'DOM Snapshot'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setExportEngine('compositor')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                      exportEngine === 'compositor' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-700'
                    }`}
                  >
                    Compositor
                  </button>
                  <button
                    onClick={() => setExportEngine('dom_snapshot')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                      exportEngine === 'dom_snapshot' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-700'
                    }`}
                  >
                    DOM Snapshot
                  </button>
                </div>
              </div>

              {audioConfig.sourceType !== 'none' && exportFormat === 'mp4' && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <Music className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    Audio track <strong>"{audioConfig.audioName || 'Active Track'}"</strong> will be mixed into the exported video file!
                  </span>
                </div>
              )}

              {/* Error Diagnostics */}
              {exportError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="font-semibold">Export Diagnostic Message:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed font-mono">{exportError}</p>
                </div>
              )}

              {/* Progress Bar */}
              {isExporting && (
                <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                      <span>Compositing & encoding asset...</span>
                    </span>
                    <span className="font-bold text-slate-900">{exportProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[var(--theme-primary)] h-full transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={exportEngine === 'compositor' ? handleExecuteExport : handleExecuteDomSnapshotExport}
                disabled={isExporting}
                className="w-full py-3.5 bg-[var(--theme-primary)] hover:bg-[#2646B8] disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing {canvasWidth} × {canvasHeight}px composition...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>
                      Download {exportFormat.toUpperCase()} ({canvasWidth} × {canvasHeight} px)
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Interactive Responsive Pin Canvas Workspace */}
        <div className="lg:col-span-5 sticky top-24 flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs font-mono text-slate-500 mb-2 px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Canvas: {canvasWidth} × {canvasHeight} px</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {PIN_SIZE_PRESETS.filter((p) => p.id !== 'custom').map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectSizePreset(p.id)}
                    className={`text-[10px] px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                      sizePreset === p.id
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title={`${p.label} (${p.width} × ${p.height}px)`}
                  >
                    {p.ratioLabel}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowSafeMargins(!showSafeMargins)}
                className={`text-[10px] px-1.5 py-0.5 rounded border cursor-pointer ${
                  showSafeMargins ? 'bg-blue-100 text-blue-800 border-blue-300 font-bold' : 'bg-slate-100 text-slate-600'
                }`}
                title="Toggle Pinterest feed safe margins"
              >
                Safe Zones
              </button>
              <button
                onClick={() => setShowGridGuides(!showGridGuides)}
                className={`text-[10px] px-1.5 py-0.5 rounded border cursor-pointer ${
                  showGridGuides ? 'bg-blue-100 text-blue-800 border-blue-300 font-bold' : 'bg-slate-100 text-slate-600'
                }`}
                title="Toggle Rule-of-Thirds Grid"
              >
                Grid
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="w-full max-w-sm flex justify-center">
            <div
              ref={canvasContainerRef}
              id="pinterest-live-canvas"
              style={getAspectRatioStyle()}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onClick={() => setSelectedLayerId(null)}
              className="w-full rounded-2xl shadow-2xl relative overflow-hidden select-none border border-slate-700/50"
            >
              {/* Background Layer */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                {/* 1. Solid Color */}
                {backgroundConfig.type === 'solid' && (
                  <div className="w-full h-full" style={{ backgroundColor: backgroundConfig.color }} />
                )}

                {/* 2. Gradient */}
                {backgroundConfig.type === 'gradient' && (
                  <div
                    className="w-full h-full"
                    style={{
                      background: `linear-gradient(to bottom right, ${backgroundConfig.gradient.from}, ${backgroundConfig.gradient.to})`,
                    }}
                  />
                )}

                {/* 3. Image */}
                {(backgroundConfig.type === 'image_upload' ||
                  backgroundConfig.type === 'image_library' ||
                  backgroundConfig.type === 'image_url') && (
                  <div
                    className="w-full h-full bg-no-repeat transition-all"
                    style={{
                      backgroundImage: `url(${backgroundConfig.imageUrl || MEDIA_LIBRARY_IMAGES[0].url})`,
                      backgroundSize: backgroundConfig.imageFit,
                      backgroundPosition: `${backgroundConfig.position.x}% ${backgroundConfig.position.y}%`,
                      transform: `scale(${backgroundConfig.zoom})`,
                      filter: `brightness(${backgroundConfig.brightness}%) contrast(${backgroundConfig.contrast}%) blur(${backgroundConfig.blur}px)`,
                      opacity: backgroundConfig.opacity / 100,
                    }}
                  />
                )}

                {/* 4. Video */}
                {(backgroundConfig.type === 'video_upload' ||
                  backgroundConfig.type === 'video_library' ||
                  backgroundConfig.type === 'video_url') && (
                  <video
                    ref={videoRef}
                    src={backgroundConfig.videoUrl || MEDIA_LIBRARY_VIDEOS[0].url}
                    poster={backgroundConfig.videoPosterUrl}
                    autoPlay
                    loop
                    muted={backgroundConfig.videoMuted}
                    playsInline
                    className={`w-full h-full object-${backgroundConfig.videoFit}`}
                    style={{
                      objectPosition: `${backgroundConfig.position.x}% ${backgroundConfig.position.y}%`,
                      transform: `scale(${backgroundConfig.zoom})`,
                      filter: `brightness(${backgroundConfig.brightness}%) contrast(${backgroundConfig.contrast}%) blur(${backgroundConfig.blur}px)`,
                    }}
                  />
                )}

                {/* Dark Overlay */}
                <div
                  className="absolute inset-0 transition-opacity"
                  style={{
                    background:
                      backgroundConfig.overlayType === 'gradient'
                        ? 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)'
                        : backgroundConfig.overlayColor,
                    opacity: (backgroundConfig.overlayOpacity || 35) / 100,
                  }}
                />
              </div>

              {/* Visual Layout Guides Overlay */}
              {showSafeMargins && (
                <div className="absolute inset-[6%] z-40 border border-dashed border-rose-400/80 pointer-events-none rounded-lg flex flex-col justify-between p-2">
                  <div className="text-[9px] font-mono text-rose-300 bg-rose-950/60 px-1 py-0.5 rounded w-fit">
                    Feed Safe Margin (Top)
                  </div>
                  <div className="text-[9px] font-mono text-rose-300 bg-rose-950/60 px-1 py-0.5 rounded w-fit self-end">
                    Safe Margin (Bottom)
                  </div>
                </div>
              )}

              {showGridGuides && (
                <div className="absolute inset-0 z-40 grid grid-cols-3 grid-rows-3 pointer-events-none">
                  <div className="border-r border-b border-blue-400/40" />
                  <div className="border-r border-b border-blue-400/40" />
                  <div className="border-b border-blue-400/40" />
                  <div className="border-r border-b border-blue-400/40" />
                  <div className="border-r border-b border-blue-400/40" />
                  <div className="border-b border-blue-400/40" />
                  <div className="border-r border-blue-400/40" />
                  <div className="border-r border-blue-400/40" />
                  <div />
                </div>
              )}

              {/* Interactive Draggable Custom Text Layers */}
              {textLayers.map((layer) => {
                const isSelected = selectedLayerId === layer.id;
                const isDragging = draggingLayerId === layer.id;

                const textTransformStyle =
                  layer.textTransform === 'none' ? 'none' : (layer.textTransform as any);

                const previewLogicalScale = previewContainerWidth / 1000;

                return (
                  <div
                    key={layer.id}
                    onMouseDown={(e) => handleLayerMouseDown(e, layer)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLayerId(layer.id);
                      setActiveTab('text_settings');
                    }}
                    style={{
                      left: `${layer.x}%`,
                      top: `${layer.y}%`,
                      width: layer.width ? `${layer.width}%` : undefined,
                      maxWidth: layer.width ? `${layer.width}%` : '85%',
                      zIndex: layer.zIndex,
                      transform: `rotate(${layer.rotation || 0}deg)`,
                      cursor: layer.isLocked ? 'default' : isDragging ? 'grabbing' : 'grab',
                    }}
                    className={`absolute transition-shadow ${
                      isSelected
                        ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-transparent rounded'
                        : 'hover:ring-1 hover:ring-white/40 rounded'
                    }`}
                  >
                    <div
                      style={{
                        width: layer.width ? '100%' : 'auto',
                        fontFamily: layer.fontFamily,
                        fontSize: `${Math.max(8, layer.fontSize * previewLogicalScale)}px`,
                        fontWeight: layer.fontWeight,
                        fontStyle: layer.fontStyle,
                        textDecoration: layer.textDecoration,
                        textAlign: layer.textAlign,
                        letterSpacing: `${(layer.letterSpacing || 0) * previewLogicalScale}px`,
                        lineHeight: layer.lineHeight || 1.25,
                        textTransform: textTransformStyle,
                        color: layer.color,
                        opacity: (layer.opacity ?? 100) / 100,
                        backgroundColor: layer.hasBackground
                          ? layer.backgroundColor || '#FBBF24'
                          : 'transparent',
                        borderRadius: layer.hasBackground
                          ? `${(layer.backgroundRadius ?? 20) * previewLogicalScale}px`
                          : '0px',
                        padding: layer.hasBackground
                          ? `${(layer.backgroundPaddingY ?? 6) * previewLogicalScale}px ${(layer.backgroundPaddingX ?? 14) * previewLogicalScale}px`
                          : '0px',
                        textShadow: layer.hasShadow
                          ? `${(layer.shadowOffsetX ?? 0) * previewLogicalScale}px ${(layer.shadowOffsetY ?? 3) * previewLogicalScale}px ${(layer.shadowBlur ?? 8) * previewLogicalScale}px ${layer.shadowColor || 'rgba(0,0,0,0.7)'}`
                          : 'none',
                        WebkitTextStroke: layer.hasOutline
                          ? `${Math.max(0.5, (layer.outlineWidth ?? 2) * previewLogicalScale)}px ${layer.outlineColor || '#000000'}`
                          : 'none',
                        whiteSpace: 'pre-wrap',
                      }}
                      className="leading-tight select-none pointer-events-auto"
                    >
                      {layer.text || `[${layer.presetType}]`}
                    </div>

                    {/* Selection Indicator Tag when selected */}
                    {isSelected && (
                      <div className="absolute -top-5 left-0 bg-blue-600 text-white font-mono text-[9px] px-1.5 py-0.5 rounded shadow flex items-center gap-1 pointer-events-none">
                        <span>{layer.presetType}</span>
                        {layer.isLocked && <Lock className="w-2.5 h-2.5 text-amber-300" />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Still Frame Download from Video Button */}
          {(backgroundConfig.type === 'video_upload' ||
            backgroundConfig.type === 'video_library' ||
            backgroundConfig.type === 'video_url') && (
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleCaptureFrameAsPoster}
                className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <Camera className="w-3.5 h-3.5" /> Capture Frame as Poster
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
