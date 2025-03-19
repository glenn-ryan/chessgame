"use client";

import React from 'react';
import { ChessGameState } from '@/lib/chessService';

interface GameStatusIndicatorProps {
  gameState: ChessGameState;
}

const GameStatusIndicator: React.FC<GameStatusIndicatorProps> = ({ gameState }) => {
  const { 
    turn, 
    isCheck, 
    isCheckmate, 
    isStalemate,
    isDraw, 
    isThreefoldRepetition,
    isInsufficientMaterial,
    is50MovesRule,
    moveCount
  } = gameState;

  // Calculate game progress approximation (mid-game around move 20-30)
  const gameStage = moveCount < 10 ? 'opening' : moveCount < 30 ? 'midgame' : 'endgame';
  
  const renderStatusBadge = () => {
    if (isCheckmate) {
      return (
        <div className="flex items-center px-3 py-1.5 bg-red-950 text-red-300 rounded-md border border-red-800 shadow-md">
          <div className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
          <span className="font-medium">Checkmate</span>
        </div>
      );
    } else if (isStalemate) {
      return (
        <div className="flex items-center px-3 py-1.5 bg-gray-900 text-gray-300 rounded-md border border-gray-700 shadow-md">
          <div className="h-2 w-2 rounded-full bg-gray-500 mr-2"></div>
          <span className="font-medium">Stalemate</span>
        </div>
      );
    } else if (isDraw) {
      let drawReason = 'Draw';
      
      if (isThreefoldRepetition) {
        drawReason = 'Threefold Repetition';
      } else if (isInsufficientMaterial) {
        drawReason = 'Insufficient Material';
      } else if (is50MovesRule) {
        drawReason = '50-Move Rule';
      }
      
      return (
        <div className="flex items-center px-3 py-1.5 bg-gray-900 text-gray-300 rounded-md border border-gray-700 shadow-md">
          <div className="h-2 w-2 rounded-full bg-gray-500 mr-2"></div>
          <span className="font-medium">{drawReason}</span>
        </div>
      );
    } else if (isCheck) {
      return (
        <div className="flex items-center px-3 py-1.5 bg-amber-900/50 text-amber-300 rounded-md border border-amber-700/50 shadow-md">
          <div className="h-2 w-2 rounded-full bg-amber-400 mr-2 animate-pulse"></div>
          <span className="font-medium">Check</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center px-3 py-1.5 bg-gray-900 text-gray-300 rounded-md border border-gray-800 shadow-md">
          <div className="h-2 w-2 rounded-full bg-amber-400 mr-2"></div>
          <span className="font-medium">{turn === 'w' ? 'White' : 'Black'} to move</span>
        </div>
      );
    }
  };

  const renderGameStage = () => {
    let stageColor = 'bg-green-400';
    let stageText = 'Opening';
    
    if (gameStage === 'midgame') {
      stageColor = 'bg-amber-400';
      stageText = 'Middlegame';
    } else if (gameStage === 'endgame') {
      stageColor = 'bg-red-400';
      stageText = 'Endgame';
    }
    
    return (
      <div className="flex items-center mt-2">
        <div className={`h-1.5 w-1.5 rounded-full ${stageColor} mr-1.5`}></div>
        <span className="text-xs text-gray-400">{stageText}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col mb-4 w-full">
      {renderStatusBadge()}
      {!isDraw && !isCheckmate && !isStalemate && renderGameStage()}
      <div className="text-sm text-gray-400 mt-2">
        Move: {moveCount}
      </div>
    </div>
  );
};

export default GameStatusIndicator; 