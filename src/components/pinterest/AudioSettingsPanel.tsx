// =============================================================================
// VeritasCraft Pinterest Studio — Music, Voice & Audio Controls Panel
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { PinAudioConfig, PinBackgroundConfig } from '../../types';
import { CURATED_AUDIO_TRACKS, CuratedAudioTrack } from './audioUtils';
import {
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Upload,
  Trash2,
  Check,
  AlertCircle,
  FileAudio,
  Radio,
  Scissors,
  Mic,
  Square,
  Repeat,
  Video,
} from 'lucide-react';

interface AudioSettingsPanelProps {
  audioConfig: PinAudioConfig;
  onChangeAudioConfig: (updates: Partial<PinAudioConfig>) => void;
  showNotification: (msg: string) => void;
  backgroundConfig?: PinBackgroundConfig;
  onChangeBackgroundConfig?: (updates: Partial<PinBackgroundConfig>) => void;
}

export const AudioSettingsPanel: React.FC<AudioSettingsPanelProps> = ({
  audioConfig,
  onChangeAudioConfig,
  showNotification,
  backgroundConfig,
  onChangeBackgroundConfig,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(audioConfig.duration || 15);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(audioConfig.trackId || null);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Live Microphone Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceStreamRef = useRef<MediaStream | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync duration when audioConfig changes
  useEffect(() => {
    if (audioConfig.duration) {
      setDuration(audioConfig.duration);
    }
  }, [audioConfig.duration]);

  // Handle Play / Pause Preview
  const togglePlayAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Playback error:', err);
          setAudioError('Unable to play audio preview in browser.');
          setIsPlaying(false);
        });
    }
  };

  // Select Curated Audio Track from Local Library
  const handleSelectCuratedTrack = (track: CuratedAudioTrack) => {
    setAudioError(null);
    setActiveTrackId(track.id);
    onChangeAudioConfig({
      sourceType: 'library',
      trackId: track.id,
      audioUrl: track.url,
      audioName: track.name,
      duration: track.duration,
      fileSize: 'High-Fidelity Studio Audio',
    });
    setDuration(track.duration);
    setCurrentTime(0);
    showNotification(`Selected soundtrack: "${track.name}"`);

    // Reset playback position
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  // Handle User File Upload (MP3, WAV, AAC, M4A)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAudioError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const supportedTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/x-m4a',
      'audio/aac',
      'audio/ogg',
      'audio/webm',
    ];
    const isSupported =
      supportedTypes.includes(file.type) ||
      file.name.endsWith('.mp3') ||
      file.name.endsWith('.wav') ||
      file.name.endsWith('.m4a');

    if (!isSupported) {
      setAudioError('Unsupported format. Please upload an MP3, WAV, AAC, or M4A audio file.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setAudioError('Audio file exceeds 50MB limit.');
      return;
    }

    const url = URL.createObjectURL(file);
    const formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    const tempAudio = new Audio(url);
    tempAudio.onloadedmetadata = () => {
      const dur = Math.round(tempAudio.duration) || 15;
      onChangeAudioConfig({
        sourceType: 'upload',
        audioUrl: url,
        audioName: file.name,
        duration: dur,
        fileSize: formattedSize,
      });
      setDuration(dur);
      setCurrentTime(0);
      showNotification(`Uploaded audio: "${file.name}" (${dur}s)`);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.currentTime = 0;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    };
    tempAudio.onerror = () => {
      setAudioError('Failed to decode audio file. Please check file format.');
    };
  };

  // Start Real Microphone Voice Narration Recording
  const handleStartVoiceRecording = async () => {
    setAudioError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setAudioError('Microphone audio recording is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceStreamRef.current = stream;
      voiceChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (evt) => {
        if (evt.data && evt.data.size > 0) {
          voiceChunksRef.current.push(evt.data);
        }
      };

      recorder.onstop = () => {
        const voiceBlob = new Blob(voiceChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });
        const voiceUrl = URL.createObjectURL(voiceBlob);
        const voiceDur = recordingSeconds || 5;

        onChangeAudioConfig({
          sourceType: 'upload',
          audioUrl: voiceUrl,
          audioName: `Voice Narration (${voiceDur}s)`,
          duration: voiceDur,
          fileSize: `${(voiceBlob.size / 1024).toFixed(0)} KB Voice Audio`,
        });
        setDuration(voiceDur);
        setCurrentTime(0);
        showNotification(`Recorded voice narration (${voiceDur}s) applied to Video Pin!`);

        // Stop mic hardware tracks
        if (voiceStreamRef.current) {
          voiceStreamRef.current.getTracks().forEach((t) => t.stop());
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone access caught:', err);
      setAudioError('Microphone access was denied or not available. Please allow mic permissions.');
    }
  };

  // Stop Microphone Voice Recording
  const handleStopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    setIsRecording(false);
  };

  // Remove Audio
  const handleRemoveAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setActiveTrackId(null);
    onChangeAudioConfig({
      sourceType: 'none',
      audioUrl: '',
      audioName: '',
      duration: 0,
    });
    showNotification('Audio track removed from Pin.');
  };

  const isVideoBackground = backgroundConfig?.type?.startsWith('video');

  return (
    <div className="space-y-6 text-xs">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded bg-rose-100 text-rose-700">
            <Music className="w-3.5 h-3.5" />
          </span>
          <h3 className="font-serif text-lg font-bold text-slate-900">
            Audio, Voice & Music Studio
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Add royalty-free studio soundtracks, upload MP3 audio, record voice narration, or mix original video audio for high-impact Video Pins.
        </p>
      </div>

      {/* Hidden Audio Player for Preview */}
      {audioConfig.audioUrl && (
        <audio
          ref={audioRef}
          src={audioConfig.audioUrl}
          loop={audioConfig.loop !== false}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Error Message */}
      {audioError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{audioError}</span>
        </div>
      )}

      {/* Voice Recording Widget */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <Mic className="w-4 h-4 text-rose-600" />
            <span>Voice Narration (Microphone)</span>
          </div>
          {isRecording && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-100 text-rose-700 text-[11px] font-mono font-bold rounded-full animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              Recording {recordingSeconds}s
            </span>
          )}
        </div>

        <p className="text-[11px] text-slate-600">
          Record your own voice to explain digital templates, announce offers, or add creator commentary.
        </p>

        {!isRecording ? (
          <button
            type="button"
            onClick={handleStartVoiceRecording}
            className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            <Mic className="w-4 h-4" />
            <span>Start Voice Recording</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStopVoiceRecording}
            className="w-full py-2 bg-slate-900 hover:bg-black text-white rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            <Square className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>Stop & Apply Voice Narration ({recordingSeconds}s)</span>
          </button>
        )}
      </div>

      {/* Active Track Status Card */}
      {audioConfig.sourceType !== 'none' && audioConfig.audioUrl ? (
        <div className="p-4 bg-slate-900 text-white rounded-xl space-y-4 shadow-sm border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <span className="p-2 rounded-lg bg-rose-600/30 text-rose-400">
                <FileAudio className="w-4 h-4" />
              </span>
              <div className="truncate">
                <div className="font-semibold text-xs truncate">
                  {audioConfig.audioName || 'Selected Audio Track'}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {audioConfig.sourceType === 'upload'
                    ? 'Uploaded File / Voice Narration'
                    : 'Curated Studio Track'} · {audioConfig.fileSize}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-[11px] font-medium cursor-pointer"
                title="Replace track"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemoveAudio}
                className="p-1 hover:bg-rose-500/20 text-rose-400 rounded cursor-pointer"
                title="Remove audio"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Player Controls */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>{Math.floor(currentTime)}s</span>
              <span>Duration: {duration}s</span>
            </div>

            {/* Scrubber Bar */}
            <input
              type="range"
              min="0"
              max={duration || 15}
              step="0.1"
              value={currentTime}
              onChange={(e) => {
                const newT = Number(e.target.value);
                setCurrentTime(newT);
                if (audioRef.current) {
                  audioRef.current.currentTime = newT;
                }
              }}
              className="w-full accent-rose-500 cursor-pointer h-1.5"
            />

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlayAudio}
                  className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full cursor-pointer transition-transform hover:scale-105"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => onChangeAudioConfig({ isMuted: !audioConfig.isMuted })}
                  className="p-1.5 hover:bg-white/10 rounded text-slate-300 cursor-pointer"
                  title={audioConfig.isMuted ? 'Unmute' : 'Mute'}
                >
                  {audioConfig.isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono">Vol:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioConfig.volume}
                  onChange={(e) => {
                    const vol = Number(e.target.value);
                    onChangeAudioConfig({ volume: vol });
                    if (audioRef.current) {
                      audioRef.current.volume = vol / 100;
                    }
                  }}
                  className="w-20 accent-rose-500 h-1 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 font-mono w-6 text-right">
                  {audioConfig.volume}%
                </span>
              </div>
            </div>
          </div>

          {/* Audio Timing & Options */}
          <div className="pt-3 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-rose-400" /> Start Time & Loop
              </span>
              <button
                type="button"
                onClick={() => onChangeAudioConfig({ loop: audioConfig.loop === false ? true : false })}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                  audioConfig.loop !== false
                    ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                    : 'bg-white/10 text-slate-400'
                }`}
              >
                <Repeat className="w-3 h-3" />
                <span>{audioConfig.loop !== false ? 'Looping' : 'No Loop'}</span>
              </button>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Start Offset</span>
                <span className="font-mono text-white">{audioConfig.startTime || 0}s</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(1, duration - 2)}
                step="0.5"
                value={audioConfig.startTime || 0}
                onChange={(e) => onChangeAudioConfig({ startTime: Number(e.target.value) })}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
          <Music className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="font-semibold text-slate-800">No Music or Voice Track Selected</div>
          <p className="text-slate-500 text-[11px]">
            Choose a soundtrack below, upload an audio clip, or record voice narration.
          </p>
        </div>
      )}

      {/* Background Video Audio Controls (When video background is active) */}
      {isVideoBackground && (
        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <Video className="w-4 h-4 text-blue-600" />
              <span>Background Video Original Sound</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onChangeBackgroundConfig && backgroundConfig) {
                  onChangeBackgroundConfig({ videoMuted: !backgroundConfig.videoMuted });
                }
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                !backgroundConfig?.videoMuted
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white border border-slate-300 text-slate-600'
              }`}
            >
              {!backgroundConfig?.videoMuted ? 'Video Audio ON' : 'Video Muted'}
            </button>
          </div>

          <p className="text-[11px] text-slate-600">
            Keep or mute the audio track embedded in your background video. When enabled, it will be mixed with your soundtrack/voice on export.
          </p>

          {!backgroundConfig?.videoMuted && (
            <div className="space-y-1 text-[11px] pt-1">
              <div className="flex justify-between text-slate-600">
                <span>Video Original Audio Volume</span>
                <span className="font-mono font-bold text-blue-800">
                  {audioConfig.originalVideoVolume ?? 80}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={audioConfig.originalVideoVolume ?? 80}
                onChange={(e) => onChangeAudioConfig({ originalVideoVolume: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          )}
        </div>
      )}

      {/* Upload Custom Audio File */}
      <div className="p-4 bg-white border-2 border-dashed border-slate-300 rounded-xl text-center space-y-3">
        <Upload className="w-6 h-6 text-slate-400 mx-auto" />
        <div>
          <div className="font-semibold text-slate-800">Upload Your Own Audio Track</div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            Supported formats: MP3, WAV, AAC, M4A, OGG
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/mp3,audio/mpeg,audio/wav,audio/aac,audio/x-m4a,audio/ogg,audio/*"
          onChange={handleFileUpload}
          className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
        />
      </div>

      {/* Curated Royalty-Free Library */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-slate-900 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-rose-600" />
            <span>Curated Royalty-Free Soundtracks</span>
          </label>
          <span className="text-[10px] text-slate-500 font-mono">100% Commercial Cleared</span>
        </div>

        <div className="space-y-2">
          {CURATED_AUDIO_TRACKS.map((track) => {
            const isSelected = audioConfig.audioUrl === track.url || activeTrackId === track.id;
            return (
              <div
                key={track.id}
                onClick={() => handleSelectCuratedTrack(track)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-rose-600 bg-rose-50/70 ring-2 ring-rose-500/20'
                    : 'border-slate-200 hover:bg-slate-50 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-xs">{track.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                      <span>{track.genre}</span>
                      <span>·</span>
                      <span>{track.tempo}</span>
                      <span>·</span>
                      <span>{track.durationFormatted}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {isSelected ? (
                    <span className="text-[10px] font-bold font-mono text-rose-700 bg-rose-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium">
                      Select
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
