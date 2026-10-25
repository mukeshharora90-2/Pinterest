// =============================================================================
// VeritasCraft — Universal Video Player & Embed Component
// Supports YouTube (Privacy-Enhanced), Vimeo, and Direct HTML5 Video (MP4, WebM)
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { VideoProvider } from '../../types';
import { parseVideoUrl } from '../../utils/mediaEmbed';
import { Play, Pause, Volume2, VolumeX, AlertCircle, Maximize } from 'lucide-react';

interface VideoPlayerEmbedProps {
  url: string;
  posterUrl?: string;
  provider?: VideoProvider;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '9/16';
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
  caption?: string;
  title?: string;
  className?: string;
}

export const VideoPlayerEmbed: React.FC<VideoPlayerEmbedProps> = ({
  url,
  posterUrl,
  provider,
  aspectRatio = '16/9',
  autoplay = false,
  muted = true,
  controls = true,
  loop = false,
  caption,
  title,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const parsed = parseVideoUrl(url);
  const effectiveProvider = provider || parsed.provider;

  // Aspect ratio CSS class
  const aspectClass =
    aspectRatio === '1/1'
      ? 'aspect-square'
      : aspectRatio === '4/3'
      ? 'aspect-4/3'
      : aspectRatio === '9/16'
      ? 'aspect-9/16'
      : 'aspect-video';

  useEffect(() => {
    if (!parsed.isValid && parsed.errorMessage) {
      setHasError(true);
      setErrorMessage(parsed.errorMessage);
    } else {
      setHasError(false);
      setErrorMessage(null);
    }
  }, [url]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (hasError || (parsed.isUnsupportedFormat && errorMessage)) {
    return (
      <div className={`w-full ${aspectClass} rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-6 text-center text-white ${className}`}>
        <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
        <h4 className="font-serif font-bold text-sm mb-1">Video Playback Notice</h4>
        <p className="text-xs text-slate-300 max-w-md leading-relaxed">{errorMessage || 'Unable to play this video source.'}</p>
        <span className="text-[10px] font-mono text-slate-400 mt-3 bg-slate-800 px-2 py-1 rounded">
          Supported web formats: MP4 (H.264), WebM, YouTube, Vimeo
        </span>
      </div>
    );
  }

  // YouTube Privacy-Enhanced Iframe
  if (effectiveProvider === 'youtube' && parsed.embedUrl) {
    return (
      <figure className={`w-full overflow-hidden rounded-xl ${className}`}>
        <div className={`w-full ${aspectClass} overflow-hidden rounded-xl bg-black border border-[var(--theme-border)] shadow-md relative`}>
          <iframe
            src={parsed.embedUrl}
            title={title || 'YouTube video embed'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="w-full h-full border-0 absolute inset-0"
          />
        </div>
        {caption && (
          <figcaption className="text-xs text-slate-500 mt-2 text-center font-sans italic">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  // Vimeo Clean Iframe
  if (effectiveProvider === 'vimeo' && parsed.embedUrl) {
    return (
      <figure className={`w-full overflow-hidden rounded-xl ${className}`}>
        <div className={`w-full ${aspectClass} overflow-hidden rounded-xl bg-black border border-[var(--theme-border)] shadow-md relative`}>
          <iframe
            src={parsed.embedUrl}
            title={title || 'Vimeo video embed'}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="w-full h-full border-0 absolute inset-0"
          />
        </div>
        {caption && (
          <figcaption className="text-xs text-slate-500 mt-2 text-center font-sans italic">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  // Direct HTML5 Video
  return (
    <figure className={`w-full overflow-hidden rounded-xl ${className}`}>
      <div className={`w-full ${aspectClass} overflow-hidden rounded-xl bg-slate-950 border border-[var(--theme-border)] shadow-md relative group`}>
        <video
          ref={videoRef}
          src={url}
          poster={posterUrl}
          autoPlay={autoplay}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            setHasError(true);
            setErrorMessage('Browser encountered an error loading this video file. Check format and network availability.');
          }}
          className="w-full h-full object-cover"
        />

        {/* Custom Overlay Play Button for unplayed video when controls are false */}
        {!controls && !isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer transition-colors hover:bg-black/40"
            aria-label="Play video"
          >
            <div className="w-14 h-14 rounded-full bg-white/90 text-slate-900 shadow-xl flex items-center justify-center pl-1 hover:scale-105 transition-transform">
              <Play className="w-6 h-6 fill-current" />
            </div>
          </button>
        )}
      </div>

      {caption && (
        <figcaption className="text-xs text-slate-500 mt-2 text-center font-sans italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
