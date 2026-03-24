import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Nights (AI Gen)',
    artist: 'SynthBot',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'Cybernetic Dreams (AI Gen)',
    artist: 'NeuralNet Audio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'Synthwave Protocol (AI Gen)',
    artist: 'AlgorithmX',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  const initAudio = () => {
    if (!audioRef.current) return;
    
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // 32 frequency bins for chunky neon bars
      analyserRef.current = analyser;
      
      // Prevent InvalidStateError in React StrictMode by checking if source exists
      try {
        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(ctx.destination);
        sourceRef.current = source;
      } catch (e) {
        console.warn('Media element source already created');
      }
    }
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      initAudio();
      audioRef.current.play().catch(e => console.error("Audio play error:", e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  // Visualizer drawing loop
  useEffect(() => {
    let animationFrameId: number;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);
      
      const canvas = canvasRef.current;
      const analyser = analyserRef.current;
      if (!canvas || !analyser) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // Get frequency data
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        // Smooth out the height and ensure a minimum height of 2px
        const percent = dataArray[i] / 255;
        const barHeight = Math.max(2, percent * canvas.height);

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#ec4899'); // Pink-500
        gradient.addColorStop(1, '#22d3ee'); // Cyan-400

        ctx.fillStyle = gradient;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ec4899';
        
        // Draw the bar from the bottom up
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

        x += barWidth;
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="flex flex-col p-6 bg-black/60 backdrop-blur-md border border-pink-500/40 rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.15)] w-full max-w-sm">
      <div className="flex items-center space-x-4 mb-6">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.5)] ${isPlaying ? 'animate-pulse' : ''}`}>
          <Music className="text-white w-6 h-6" />
        </div>
        <div>
          <h3 className="text-pink-400 font-bold text-lg drop-shadow-[0_0_5px_rgba(236,72,153,0.8)] truncate w-48">
            {currentTrack.title}
          </h3>
          <p className="text-cyan-300/70 text-sm font-mono">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Visualizer Canvas */}
      <canvas
        ref={canvasRef}
        width={256}
        height={64}
        className="w-full h-16 mb-6 rounded-lg bg-black/40 border border-cyan-500/20 shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]"
      />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
        crossOrigin="anonymous"
        className="hidden"
      />

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevTrack}
          className="p-2 text-cyan-400 hover:text-pink-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button
          onClick={togglePlay}
          className="p-4 bg-cyan-500/20 border border-cyan-400 rounded-full text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.8)]"
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
        
        <button
          onClick={nextTrack}
          className="p-2 text-cyan-400 hover:text-pink-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center space-x-3">
        <Volume2 className="w-5 h-5 text-gray-400" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
        />
      </div>
      
      <div className="mt-6 space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-mono mb-2">Playlist</p>
        {TRACKS.map((track, idx) => (
          <div 
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(idx);
              setIsPlaying(true);
            }}
            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
              idx === currentTrackIndex 
                ? 'bg-pink-500/20 border border-pink-500/30' 
                : 'hover:bg-white/5'
            }`}
          >
            <span className={`text-sm ${idx === currentTrackIndex ? 'text-pink-400' : 'text-gray-400'}`}>
              {track.title}
            </span>
            {idx === currentTrackIndex && isPlaying && (
              <div className="flex space-x-1">
                <div className="w-1 h-3 bg-pink-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-3 bg-pink-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1 h-3 bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
