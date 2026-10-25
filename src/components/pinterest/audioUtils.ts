// =============================================================================
// VeritasCraft Pinterest Studio — Audio & Music Utilities & Mixing Engine
// =============================================================================

export interface CuratedAudioTrack {
  id: string;
  name: string;
  genre: string;
  tempo: string;
  duration: number; // in seconds
  durationFormatted: string;
  url: string;
  description: string;
}

// Curated royalty-free background music tracks for video Pins
// Served reliably from local public assets
export const CURATED_AUDIO_TRACKS: CuratedAudioTrack[] = [
  {
    id: 'lofi_chill',
    name: 'Lo-Fi Creator Chill & Focus',
    genre: 'Lo-Fi / Ambient',
    tempo: '82 BPM',
    duration: 15,
    durationFormatted: '0:15',
    url: '/audio/lofi_chill.wav',
    description: 'Warm Rhodes electric chords with relaxed lo-fi groove and subtle harmonic texture.',
  },
  {
    id: 'acoustic_indie',
    name: 'Minimalist Acoustic Fingerpicking',
    genre: 'Acoustic / Warm',
    tempo: '96 BPM',
    duration: 18,
    durationFormatted: '0:18',
    url: '/audio/acoustic_warm.wav',
    description: 'Clean acoustic chords with cheerful organic progression. Perfect for lifestyle & planner pins.',
  },
  {
    id: 'ambient_piano',
    name: 'Elevated Ambient Piano Reverie',
    genre: 'Cinematic / Modern',
    tempo: '75 BPM',
    duration: 20,
    durationFormatted: '0:20',
    url: '/audio/ambient_piano.wav',
    description: 'Gentle, modern minimalist piano notes with lush hall resonance for luxury aesthetic pins.',
  },
  {
    id: 'tech_pulse',
    name: 'Modern Electronic Pulse & Drive',
    genre: 'Electronic / Upbeat',
    tempo: '118 BPM',
    duration: 16,
    durationFormatted: '0:16',
    url: '/audio/tech_pulse.wav',
    description: 'Subtle rhythmic synth plucks with modern pacing for Notion systems and tech tutorials.',
  },
  {
    id: 'coffee_jazz',
    name: 'Warm Coffeehouse Jazz Chords',
    genre: 'Smooth Jazz',
    tempo: '88 BPM',
    duration: 14,
    durationFormatted: '0:14',
    url: '/audio/coffee_jazz.wav',
    description: 'Mellow guitar voicings and soft brush rhythm for cozy creator desks and morning routines.',
  },
];

/**
 * Generate a synthetic harmonic ambient melody using Web Audio API.
 * This guarantees audio always works 100% offline or if remote CDNs are blocked.
 */
export function createSyntheticAmbientTrack(
  ctx: AudioContext,
  durationSeconds: number = 10,
  rootFreq: number = 220
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const numFrames = Math.floor(sampleRate * durationSeconds);
  const buffer = ctx.createBuffer(2, numFrames, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  // Pentatonic scale based on rootFreq
  const notes = [
    rootFreq,
    rootFreq * 1.25,
    rootFreq * 1.5,
    rootFreq * 1.667,
    rootFreq * 2,
  ];

  for (let i = 0; i < numFrames; i++) {
    const t = i / sampleRate;
    const noteIndex = Math.floor(t * 1.5) % notes.length;
    const note1 = notes[noteIndex];
    const note2 = notes[(noteIndex + 2) % notes.length];

    const env = Math.sin(((t % 0.66) / 0.66) * Math.PI);
    const fade = Math.min(1, t / 0.5) * Math.min(1, (durationSeconds - t) / 0.5);

    const s1 = Math.sin(2 * Math.PI * note1 * t) * 0.2 * env * fade;
    const s2 = Math.sin(2 * Math.PI * (note2 * 0.5) * t) * 0.15 * fade;
    const shimmer = Math.sin(2 * Math.PI * (note1 * 2) * t) * 0.05 * env * fade;

    left[i] = Math.max(-1, Math.min(1, s1 + s2));
    right[i] = Math.max(-1, Math.min(1, s1 * 0.8 + shimmer * 1.2 + s2));
  }

  return buffer;
}

/**
 * Load an audio source URL into an AudioBuffer with graceful fallback
 */
export async function loadAudioBuffer(
  audioCtx: AudioContext,
  audioSourceUrl: string,
  trackId?: string
): Promise<AudioBuffer> {
  try {
    const response = await fetch(audioSourceUrl);
    if (!response.ok) {
      throw new Error(`Failed to load audio: HTTP ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return await audioCtx.decodeAudioData(arrayBuffer.slice(0));
  } catch (err) {
    console.warn('Audio decoding fallback to synthetic harmonic audio:', err);
    let rootFreq = 220;
    if (trackId === 'tech_pulse') rootFreq = 330;
    if (trackId === 'acoustic_indie') rootFreq = 293.66;
    if (trackId === 'ambient_piano') rootFreq = 261.63;
    if (trackId === 'coffee_jazz') rootFreq = 246.94;
    return createSyntheticAmbientTrack(audioCtx, 15, rootFreq);
  }
}

export interface AudioMixOptions {
  audioUrl?: string;
  volume?: number; // 0 to 100
  isMuted?: boolean;
  startTime?: number; // in seconds
  loop?: boolean;
  trackId?: string;
  // Background video original sound
  videoElement?: HTMLVideoElement | null;
  videoMuted?: boolean;
  videoVolume?: number; // 0 to 100
}

/**
 * Mix background music, voice narration, and background video audio
 * into the recording MediaStream with real synchronization and volume control.
 */
export async function mixAudioIntoVideoStream(
  videoStream: MediaStream,
  options: AudioMixOptions
): Promise<{ stream: MediaStream; cleanup: () => void; hasAudibleAudio: boolean }> {
  const AudioContextClass =
    window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) {
    console.warn('Web Audio API not supported in this browser environment');
    return { stream: videoStream, cleanup: () => {}, hasAudibleAudio: false };
  }

  const cleanups: (() => void)[] = [];

  try {
    const audioCtx = new AudioContextClass();

    // In modern browsers, AudioContext starts suspended until user interaction
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    const dest = audioCtx.createMediaStreamDestination();
    let hasAudibleAudio = false;

    // 1. Process Added Audio (Music / Uploaded MP3 / Voice Recording)
    const musicUrl = options.audioUrl;
    const isMusicMuted = !!options.isMuted;
    const musicVolume = options.volume ?? 80;

    if (musicUrl && !isMusicMuted && musicVolume > 0) {
      try {
        const audioBuffer = await loadAudioBuffer(audioCtx, musicUrl, options.trackId);
        const sourceNode = audioCtx.createBufferSource();
        sourceNode.buffer = audioBuffer;
        sourceNode.loop = options.loop !== false; // default loop

        const gainNode = audioCtx.createGain();
        const normalizedVol = Math.max(0, Math.min(1, musicVolume / 100));
        gainNode.gain.setValueAtTime(normalizedVol, audioCtx.currentTime);

        sourceNode.connect(gainNode);
        gainNode.connect(dest);

        // Start playback with trim start offset
        const offset = Math.max(0, options.startTime || 0) % (audioBuffer.duration || 1);
        sourceNode.start(0, offset);
        hasAudibleAudio = true;

        cleanups.push(() => {
          try {
            sourceNode.stop();
            sourceNode.disconnect();
            gainNode.disconnect();
          } catch {
            // ignore cleanup errors
          }
        });
      } catch (err) {
        console.warn('Failed to load AudioBuffer source, trying HTMLAudioElement fallback:', err);
        try {
          const audioEl = new Audio();
          audioEl.crossOrigin = 'anonymous';
          audioEl.src = musicUrl;
          audioEl.loop = options.loop !== false;
          audioEl.currentTime = options.startTime || 0;

          const sourceNode = audioCtx.createMediaElementSource(audioEl);
          const gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, musicVolume / 100)), audioCtx.currentTime);

          sourceNode.connect(gainNode);
          gainNode.connect(dest);

          await audioEl.play().catch((e) => console.warn('Audio element play caught:', e));
          hasAudibleAudio = true;

          cleanups.push(() => {
            try {
              audioEl.pause();
              audioEl.src = '';
              sourceNode.disconnect();
              gainNode.disconnect();
            } catch {
              // ignore
            }
          });
        } catch (fbErr) {
          console.warn('HTMLAudioElement fallback also failed:', fbErr);
        }
      }
    }

    // 2. Process Original Background Video Audio (if background is a video and not muted)
    if (options.videoElement && !options.videoMuted && (options.videoVolume ?? 80) > 0) {
      try {
        let videoAudioNode: AudioNode | null = null;
        // Check if videoElement has captureStream with audio tracks
        const vid = options.videoElement as unknown as { captureStream?: () => MediaStream; mozCaptureStream?: () => MediaStream };
        const vidStream = vid.captureStream ? vid.captureStream() : vid.mozCaptureStream ? vid.mozCaptureStream() : null;

        if (vidStream && vidStream.getAudioTracks().length > 0) {
          videoAudioNode = audioCtx.createMediaStreamSource(vidStream);
        } else {
          // Fall back to createMediaElementSource
          try {
            videoAudioNode = audioCtx.createMediaElementSource(options.videoElement);
          } catch (e) {
            console.warn('Video element already connected to audio node:', e);
          }
        }

        if (videoAudioNode) {
          const videoGain = audioCtx.createGain();
          const vidVol = Math.max(0, Math.min(1, (options.videoVolume ?? 80) / 100));
          videoGain.gain.setValueAtTime(vidVol, audioCtx.currentTime);

          videoAudioNode.connect(videoGain);
          videoGain.connect(dest);
          hasAudibleAudio = true;

          cleanups.push(() => {
            try {
              videoAudioNode?.disconnect();
              videoGain.disconnect();
            } catch {
              // ignore
            }
          });
        }
      } catch (vidErr) {
        console.warn('Could not mix background video audio:', vidErr);
      }
    }

    // If no audible audio tracks were produced, return the video-only stream
    const audioTracks = dest.stream.getAudioTracks();
    if (!hasAudibleAudio || audioTracks.length === 0) {
      return {
        stream: videoStream,
        cleanup: () => {
          cleanups.forEach((c) => c());
          try {
            audioCtx.close();
          } catch {}
        },
        hasAudibleAudio: false,
      };
    }

    // Combine visual video tracks and audible audio tracks into one stream
    const combinedStream = new MediaStream([
      ...videoStream.getVideoTracks(),
      ...audioTracks,
    ]);

    const cleanup = () => {
      cleanups.forEach((c) => c());
      try {
        audioCtx.close();
      } catch (err) {
        console.warn('AudioContext close notice:', err);
      }
    };

    return { stream: combinedStream, cleanup, hasAudibleAudio: true };
  } catch (err) {
    console.warn('Audio mixing encountered an error; falling back to video stream:', err);
    return { stream: videoStream, cleanup: () => {}, hasAudibleAudio: false };
  }
}
