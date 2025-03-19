"use client";

import ChessBoard from '@/components/chessboard/ChessBoard';
import { useEffect, useState } from 'react';

export default function Home() {
  const [boardWidth, setBoardWidth] = useState(560);

  useEffect(() => {
    // Update board width based on screen size
    const updateWidth = () => {
      // For mobile, use smaller board size
      if (window.innerWidth < 768) {
        setBoardWidth(Math.min(320, window.innerWidth - 48));
      } else {
        // For larger screens, cap at 560px
        setBoardWidth(Math.min(560, window.innerWidth - 96));
      }
    };

    // Initial calculation
    updateWidth();

    // Update on resize
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 bg-gray-950">
      <div className="max-w-6xl w-full mb-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-amber-400">Chess Game</h1>
        <p className="text-center text-gray-400">
          A modern chess experience with Next.js
        </p>
      </div>

      <div className="w-full flex justify-center">
        <ChessBoard width={boardWidth} />
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <div className="bg-gray-900 shadow-xl rounded-lg p-6 border border-amber-800/30">
          <h2 className="text-xl font-semibold mb-3 text-amber-300">How to Play</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>Click on a piece to select it</li>
            <li>Green highlights show valid move destinations</li>
            <li>Click on a highlighted square to move the piece</li>
            <li>Use the controls to start a new game or undo moves</li>
          </ul>
        </div>

        <div className="bg-gray-900 shadow-xl rounded-lg p-6 border border-amber-800/30">
          <h2 className="text-xl font-semibold mb-3 text-amber-300">About</h2>
          <p className="text-gray-300">
            This chess game is built with Next.js, TypeScript, and Tailwind CSS.
            It uses chess.js for move validation and game state management.
          </p>
        </div>
      </div>
    </main>
  );
}
