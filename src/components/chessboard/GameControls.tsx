"use client";

import React, { useState } from 'react';
import { ChessGameState } from '@/lib/chessService';

interface GameControlsProps {
  gameState: ChessGameState;
  onNewGame: () => void;
  onUndo: () => void;
  onFlipBoard?: () => void;
  onExportPGN?: () => void;
  onExportFEN?: () => void;
  onOfferDraw?: () => void;
  onResign?: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onNewGame,
  onUndo,
  onFlipBoard,
  onExportPGN,
  onExportFEN,
  onOfferDraw,
  onResign
}) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  const { 
    turn, 
    isCheck, 
    isCheckmate, 
    isStalemate,
    isDraw, 
    isThreefoldRepetition,
    isInsufficientMaterial,
    is50MovesRule,
    isGameOver,
    moveCount 
  } = gameState;

  const renderGameStatus = () => {
    if (isCheckmate) {
      return <div className="text-red-400 font-bold">{turn === 'w' ? 'Black' : 'White'} wins by checkmate!</div>;
    } else if (isStalemate) {
      return <div className="text-gray-300 font-bold">Game drawn by stalemate</div>;
    } else if (isThreefoldRepetition) {
      return <div className="text-gray-300 font-bold">Game drawn by threefold repetition</div>;
    } else if (isInsufficientMaterial) {
      return <div className="text-gray-300 font-bold">Game drawn by insufficient material</div>;
    } else if (is50MovesRule) {
      return <div className="text-gray-300 font-bold">Game drawn by 50-move rule</div>;
    } else if (isDraw) {
      return <div className="text-gray-300 font-bold">Game ended in a draw</div>;
    } else if (isCheck) {
      return <div className="text-amber-400 font-bold">{turn === 'w' ? 'White' : 'Black'} is in check</div>;
    } else if (isGameOver) {
      return <div className="text-amber-400 font-bold">Game over</div>;
    } else {
      return <div className="text-gray-300">{turn === 'w' ? 'White' : 'Black'} to move</div>;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6 w-full">
      <div className="bg-gray-900 p-3 rounded-md w-full border border-gray-800 shadow-md">
        {renderGameStatus()}
        <div className="text-sm text-gray-400 mt-1">
          Move: {moveCount}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <button 
          onClick={onNewGame}
          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition text-sm shadow-md"
        >
          New Game
        </button>
        <button 
          onClick={onUndo}
          disabled={gameState.history.length === 0}
          className={`px-3 py-1.5 text-white rounded-md transition text-sm shadow-md ${
            gameState.history.length === 0 
              ? 'bg-gray-700 cursor-not-allowed' 
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          Undo Move
        </button>
        {onFlipBoard && (
          <button
            onClick={onFlipBoard}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition text-sm shadow-md"
          >
            Flip Board
          </button>
        )}
        <button 
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition text-sm shadow-md"
        >
          {showAdvancedOptions ? 'Hide Options' : 'More Options'}
        </button>
      </div>
      
      {showAdvancedOptions && (
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {!isGameOver && onOfferDraw && (
            <button
              onClick={onOfferDraw}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition text-sm shadow-md"
            >
              Offer Draw
            </button>
          )}
          {!isGameOver && onResign && (
            <button
              onClick={onResign}
              className="px-3 py-1.5 bg-red-900 hover:bg-red-800 text-white rounded-md transition text-sm shadow-md"
            >
              Resign
            </button>
          )}
          {onExportPGN && (
            <button
              onClick={onExportPGN}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition text-sm shadow-md"
            >
              Export PGN
            </button>
          )}
          {onExportFEN && (
            <button
              onClick={onExportFEN}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition text-sm shadow-md"
            >
              Export FEN
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GameControls; 