"use client";

import React, { useState } from 'react';
import { Move } from 'chess.js';

interface MoveHistoryProps {
  history: Move[];
  onSelectMove?: (index: number) => void;
  currentMoveIndex?: number;
}

interface GroupedMove {
  moveNumber: number;
  whiteMove: Move;
  blackMove?: Move;
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ 
  history, 
  onSelectMove,
  currentMoveIndex = history.length - 1
}) => {
  const [expanded, setExpanded] = useState(true);
  const groupedHistory: GroupedMove[] = [];

  // Group moves in pairs for display
  for (let i = 0; i < history.length; i += 2) {
    groupedHistory.push({
      moveNumber: Math.floor(i / 2) + 1,
      whiteMove: history[i],
      blackMove: i + 1 < history.length ? history[i + 1] : undefined
    });
  }

  // Function to render move with additional info
  const renderMove = (move: Move | undefined, index: number) => {
    if (!move) return null;
    
    // Prefer using move.from and move.to for displaying positions
    // This ensures correct display regardless of board orientation
    console.log(`Move ${index}:`, move);
    
    // Get the piece type (P for pawn, N for knight, etc.)
    const pieceType = move.piece.toUpperCase() === 'P' ? '' : move.piece.toUpperCase();
    
    // Get original SAN notation (this is what chess.js provides)
    let moveText = move.san;
    
    // For clarity, we can also use the explicit from-to notation
    const fromTo = `${pieceType}${move.from}-${move.to}`;
    
    // Add capture and check indicators
    if (move.flags.includes('c')) {
      moveText = moveText.replace('x', '×'); // Using a better "capture" symbol
    }
    
    // Add promotion indicator if applicable
    if (move.flags.includes('p')) {
      const promotionPiece = move.promotion?.toUpperCase();
      if (promotionPiece) {
        moveText += `=${promotionPiece}`;
      }
    }
    
    // Determine if this move is the current move
    const isCurrent = index === currentMoveIndex;
    
    return (
      <div className="flex flex-col">
        <button
          className={`font-mono text-left ${isCurrent ? 'bg-amber-600/60 text-white px-1.5 py-0.5 rounded' : ''} ${onSelectMove ? 'hover:text-amber-400 cursor-pointer transition-colors' : ''}`}
          onClick={() => onSelectMove && onSelectMove(index)}
          disabled={!onSelectMove}
        >
          {moveText}
          {move.captured && (
            <span className="ml-1 text-red-400 text-sm">
              ({move.captured})
            </span>
          )}
        </button>
        <span className="text-xs text-gray-500 mt-1">{fromTo}</span>
      </div>
    );
  };

  return (
    <div className="mt-6 max-w-md w-full border border-gray-800 rounded-md bg-gray-900 shadow-lg">
      <div 
        className="flex justify-between items-center p-3 border-b border-gray-800 cursor-pointer bg-gray-900"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-lg font-semibold text-amber-400">Move History</h3>
        <button className="text-amber-400 hover:text-amber-300 transition-colors">
          {expanded ? '▼' : '▶'}
        </button>
      </div>
      
      {expanded && (
        <div className="bg-gray-900 p-3 max-h-80 overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-gray-400 text-center py-4">No moves yet</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-2 w-10 text-amber-400">#</th>
                  <th className="text-left py-2 text-amber-400">White</th>
                  <th className="text-left py-2 text-amber-400">Black</th>
                </tr>
              </thead>
              <tbody>
                {groupedHistory.map(({ moveNumber, whiteMove, blackMove }) => (
                  <tr key={moveNumber} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors">
                    <td className="py-2 text-gray-500">{moveNumber}.</td>
                    <td className="py-2 text-gray-300">
                      {renderMove(whiteMove, (moveNumber - 1) * 2)}
                    </td>
                    <td className="py-2 text-gray-300">
                      {blackMove ? renderMove(blackMove, (moveNumber - 1) * 2 + 1) : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default MoveHistory; 