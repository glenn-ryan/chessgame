"use client";

import React from 'react';

interface PlayerInfoProps {
  name?: string;
  color: 'white' | 'black';
  isActive: boolean;
  capturedPieces: string[];
  timeRemaining?: number; // in seconds, optional for games without time control
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({
  color,
  name,
  isActive,
  capturedPieces,
  timeRemaining
}) => {
  // Use default name if not provided
  const playerName = name || (color === 'white' ? 'White' : 'Black');
  
  const formatTime = (seconds?: number): string => {
    if (seconds === undefined) return '';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getPieceSymbol = (piece: string): string => {
    const symbols: Record<string, Record<string, string>> = {
      w: {
        p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔'
      },
      b: {
        p: '♟︎', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚'
      }
    };
    
    const pieceType = piece.toLowerCase();
    const pieceColor = piece === piece.toUpperCase() ? 'w' : 'b';
    
    return symbols[pieceColor][pieceType];
  };
  
  const renderCapturedPiece = (piece: string, index: number) => {
    const pieceType = piece.toLowerCase();
    const pieceColor = piece === piece.toUpperCase() ? 'w' : 'b';
    const symbol = getPieceSymbol(piece);
    
    const isWhitePiece = pieceColor === 'w';
    
    // Special styling based on piece type
    const getPieceStyles = () => {
      const baseClasses = "text-xl transform transition-transform hover:scale-110";
      
      if (isWhitePiece) {
        switch(pieceType) {
          case 'q': return `${baseClasses} text-red-200 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]`;
          case 'r': return `${baseClasses} text-blue-200 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]`;
          case 'b': 
          case 'n': return `${baseClasses} text-green-200 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]`;
          default: return `${baseClasses} text-gray-200 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]`;
        }
      } else {
        switch(pieceType) {
          case 'q': return `${baseClasses} text-red-900 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]`;
          case 'r': return `${baseClasses} text-blue-900 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]`;
          case 'b': 
          case 'n': return `${baseClasses} text-green-900 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]`;
          default: return `${baseClasses} text-gray-900 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]`;
        }
      }
    };
    
    return (
      <div 
        key={index} 
        className={getPieceStyles()}
        title={`Captured ${isWhitePiece ? 'White' : 'Black'} ${
          pieceType === 'p' ? 'Pawn' :
          pieceType === 'n' ? 'Knight' :
          pieceType === 'b' ? 'Bishop' :
          pieceType === 'r' ? 'Rook' :
          pieceType === 'q' ? 'Queen' : 'King'
        }`}
      >
        {symbol}
      </div>
    );
  };

  return (
    <div className={`flex items-center justify-between rounded-md p-3 w-full ${
      isActive 
        ? 'bg-amber-700/30 border border-amber-500/50' 
        : 'bg-gray-900 border border-gray-800'
    } transition-colors shadow-md`}>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${
          color === 'white' ? 'bg-gray-100 border border-gray-300' : 'bg-gray-900 border border-gray-700'
        }`}></div>
        <div className={`font-medium ${color === 'white' ? 'text-gray-100' : 'text-gray-300'}`}>
          {playerName}
        </div>
        {isActive && (
          <div className="text-xs bg-amber-500 text-gray-900 px-1.5 py-0.5 rounded-full font-semibold">
            Turn
          </div>
        )}
      </div>
      
      {timeRemaining !== undefined && (
        <div className="font-mono text-lg text-amber-300">
          {formatTime(timeRemaining)}
        </div>
      )}
      
      <div className="flex flex-wrap gap-1 max-w-xs">
        {capturedPieces.map((piece, index) => renderCapturedPiece(piece, index))}
      </div>
    </div>
  );
};

export default PlayerInfo; 