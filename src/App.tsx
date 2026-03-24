import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden relative flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Neon Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="mb-12 text-center z-10">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] uppercase">
          Neon Snake
        </h1>
        <p className="mt-2 text-cyan-400 font-mono tracking-widest text-lg drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
          & BEATS
        </p>
      </header>

      <main className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-6xl z-10">
        {/* Left Side - Music Player */}
        <div className="w-full max-w-sm flex-shrink-0 animate-fade-in-left">
          <MusicPlayer />
        </div>

        {/* Center - Snake Game */}
        <div className="flex-grow flex justify-center animate-fade-in-up">
          <SnakeGame onScoreChange={handleScoreChange} />
        </div>

        {/* Right Side - Stats / Info */}
        <div className="w-full max-w-sm flex-shrink-0 flex flex-col gap-6 animate-fade-in-right">
          <div className="bg-black/60 backdrop-blur-md border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
            <h2 className="text-cyan-400 font-mono text-sm uppercase tracking-widest mb-2 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
              High Score
            </h2>
            <div className="text-5xl font-black text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]">
              {highScore}
            </div>
          </div>
          
          <div className="bg-black/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <h2 className="text-gray-400 font-mono text-sm uppercase tracking-widest mb-4">
              Controls
            </h2>
            <ul className="space-y-3 text-sm font-mono text-gray-300">
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span>Move</span>
                <span className="text-cyan-400">WASD / Arrows</span>
              </li>
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span>Pause</span>
                <span className="text-pink-400">Space</span>
              </li>
              <li className="flex justify-between">
                <span>Restart</span>
                <span className="text-cyan-400">Enter</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      
      <footer className="mt-auto pt-12 text-center text-gray-600 font-mono text-xs z-10">
        AI Generated Audio Tracks from SoundHelix
      </footer>
    </div>
  );
}
