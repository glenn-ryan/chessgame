"use client";

import React, { useState, useEffect } from 'react';
import ChessService, { ChessGameState } from '@/lib/chessService';
import GameControls from './GameControls';
import MoveHistory from './MoveHistory';
import PlayerInfo from './PlayerInfo';
import GameStatusIndicator from './GameStatusIndicator';

interface ChessBoardProps {
  width?: number;
}

interface SquareProps {
  black: boolean;
  piece?: string;
  position: string;
  selected: boolean;
  isLegalMove: boolean;
  isLastMove: boolean;
  onClick: (position: string) => void;
  children?: React.ReactNode;
}

const Square: React.FC<SquareProps> = ({
  black,
  piece,
  position,
  selected,
  isLegalMove,
  isLastMove,
  onClick,
  children
}) => {
  // Updated colors for better contrast
  const baseClass = black ? 'bg-gray-800' : 'bg-amber-200';
  // Make selection more obvious with a bright gold highlight
  const selectedClass = selected ? 'bg-yellow-500 ring-2 ring-yellow-300' : '';
  const legalMoveClass = isLegalMove ? 'bg-green-400/30' : '';
  const lastMoveClass = isLastMove ? 'bg-blue-400/30' : '';
  
  // Add a slight inner glow to improve piece visibility
  const innerGlowClass = black ? 'inner-glow-dark' : 'inner-glow-light';
  
  return (
    <div 
      className={`${baseClass} ${selectedClass} ${legalMoveClass} ${lastMoveClass} ${innerGlowClass} flex items-center justify-center h-full w-full relative shadow-inner transition-colors duration-150`}
      onClick={() => onClick(position)}
      style={{
        boxShadow: black ? 'inset 0 0 10px rgba(0, 0, 0, 0.3)' : 'inset 0 0 10px rgba(255, 255, 255, 0.3)'
      }}
    >
      {piece && (
        <div className="text-4xl">{piece}</div>
      )}
      {children}
      {isLegalMove && !piece && !children && (
        <div className="absolute w-5 h-5 rounded-full bg-amber-400 animate-pulse ring-2 ring-amber-300 shadow-lg"></div>
      )}
      {isLegalMove && children && (
        <div className="absolute inset-0 border-4 border-amber-400 rounded-full scale-75 animate-ping opacity-70"></div>
      )}
    </div>
  );
};

const ChessBoard: React.FC<ChessBoardProps> = ({ width = 560 }) => {
  const [chessService] = useState(new ChessService());
  const [gameState, setGameState] = useState<ChessGameState>(chessService.getGameState());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [boardFlipped, setBoardFlipped] = useState(false);
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number | null>(null);

  const squareSize = width / 8;
  
  useEffect(() => {
    // Update legal moves when a square is selected
    if (selectedSquare) {
      const moves = chessService.getLegalMoves(selectedSquare);
      console.log(`Legal moves for ${selectedSquare}:`, moves);
      setLegalMoves(moves);
    } else {
      setLegalMoves([]);
    }
  }, [selectedSquare, chessService]);

  // Update current move index when history changes
  useEffect(() => {
    setCurrentMoveIndex(gameState.history.length - 1);
  }, [gameState.history.length]);

  const handleNewGame = () => {
    chessService.reset();
    setGameState(chessService.getGameState());
    setSelectedSquare(null);
    setLegalMoves([]);
    setCurrentMoveIndex(null);
  };

  const handleUndo = () => {
    if (chessService.undo()) {
      setGameState(chessService.getGameState());
      setSelectedSquare(null);
      setLegalMoves([]);
      setCurrentMoveIndex(gameState.history.length - 2);
    }
  };

  const handleFlipBoard = () => {
    console.log('Flipping board');
    setBoardFlipped(!boardFlipped);
  };

  const handleExportPGN = () => {
    // This would typically copy PGN to clipboard or open a download dialog
    alert('PGN export would happen here');
  };

  const handleExportFEN = () => {
    // This would typically copy FEN to clipboard
    alert(`Current position FEN: ${gameState.fen}`);
  };

  const handleOfferDraw = () => {
    // In a multiplayer implementation, this would send a draw offer
    alert('Draw offer would be sent to opponent');
  };

  const handleResign = () => {
    // In a multiplayer implementation, this would resign the game
    alert(`${gameState.turn === 'w' ? 'White' : 'Black'} resigns`);
  };
  
  const handleSelectMove = (index: number) => {
    // This would implement a history navigation feature
    setCurrentMoveIndex(index);
    // In a complete implementation, this would show the position after the selected move
    alert(`Selected move at index ${index}`);
  };
  
  const handleSquareClick = (position: string) => {
    // If game is over, don't allow moves
    if (gameState.isGameOver) {
      return;
    }
    
    // Log for debugging
    console.log(`Clicked position: ${position}, Board flipped: ${boardFlipped}`);
    
    // If a square is already selected, try to move the piece
    if (selectedSquare !== null) {
      // If clicking on the same square, deselect it
      if (selectedSquare === position) {
        setSelectedSquare(null);
        return;
      }
      
      // Check if the clicked position is a legal move
      if (legalMoves.includes(position)) {
        console.log(`Making move from ${selectedSquare} to ${position}`);
        // Try to make a move - these positions are already in correct algebraic notation
        // The chess.js library uses standard algebraic notation for moves regardless of visual board orientation
        if (chessService.makeMove(selectedSquare, position)) {
          const updatedGameState = chessService.getGameState();
          console.log(`Move made, last move in history:`, updatedGameState.history[updatedGameState.history.length - 1]);
          setGameState(updatedGameState);
          setSelectedSquare(null);
        }
      } else {
        // Check if the new square has a piece of the current player's color
        const fenBoard = gameState.fen.split(' ')[0];
        const rows = fenBoard.split('/');
        
        // Convert algebraic notation to board indices
        const row = 8 - parseInt(position[1]);
        const col = position.charCodeAt(0) - 97;
        
        if (row < 0 || row > 7 || col < 0 || col > 7) {
          return; // Invalid position
        }
        
        let pieceAtPosition = null;
        let currentCol = 0;
        
        // Parse FEN to find the piece at the position
        const rowString = rows[row];
        for (let i = 0; i < rowString.length; i++) {
          const char = rowString[i];
          if (isNaN(Number(char))) {
            // It's a piece
            if (currentCol === col) {
              pieceAtPosition = char;
              break;
            }
            currentCol++;
          } else {
            // It's a number (empty squares)
            const emptyCount = parseInt(char);
            if (currentCol <= col && col < currentCol + emptyCount) {
              break;
            }
            currentCol += emptyCount;
          }
        }
        
        console.log(`Piece at ${position}: ${pieceAtPosition}`);
        
        // If there's a piece of the current player's color, select it
        if (pieceAtPosition && 
            ((gameState.turn === 'w' && pieceAtPosition === pieceAtPosition.toUpperCase()) || 
             (gameState.turn === 'b' && pieceAtPosition === pieceAtPosition.toLowerCase()))) {
          setSelectedSquare(position);
        } else {
          // If it's not a valid move or friendly piece, deselect
          setSelectedSquare(null);
        }
      }
    } else {
      // No square is selected, try to select a piece
      const fenBoard = gameState.fen.split(' ')[0];
      const rows = fenBoard.split('/');
      
      // Convert algebraic notation to board indices
      const row = 8 - parseInt(position[1]);
      const col = position.charCodeAt(0) - 97;
      
      if (row < 0 || row > 7 || col < 0 || col > 7) {
        return; // Invalid position
      }
      
      let pieceAtPosition = null;
      let currentCol = 0;
      
      // Parse FEN to find the piece at the position
      const rowString = rows[row];
      for (let i = 0; i < rowString.length; i++) {
        const char = rowString[i];
        if (isNaN(Number(char))) {
          // It's a piece
          if (currentCol === col) {
            pieceAtPosition = char;
            break;
          }
          currentCol++;
        } else {
          // It's a number (empty squares)
          const emptyCount = parseInt(char);
          if (currentCol <= col && col < currentCol + emptyCount) {
            break;
          }
          currentCol += emptyCount;
        }
      }
      
      console.log(`Selected piece at ${position}: ${pieceAtPosition}`);
      
      // Only select squares with pieces of the current player's color
      if (pieceAtPosition && 
          ((gameState.turn === 'w' && pieceAtPosition === pieceAtPosition.toUpperCase()) || 
           (gameState.turn === 'b' && pieceAtPosition === pieceAtPosition.toLowerCase()))) {
        setSelectedSquare(position);
      }
    }
  };
  
  const getPieceSymbol = (color: string, type: string): string => {
    const symbols: Record<string, Record<string, string>> = {
      w: {
        p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔'
      },
      b: {
        p: '♟︎', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚'
      }
    };
    return symbols[color][type];
  };

  // Component to render a nicer looking chess piece
  const ChessPiece: React.FC<{piece: string, color: string, isSelected?: boolean}> = ({piece, color, isSelected = false}) => {
    const getPieceClasses = () => {
      const baseClasses = "transform transition-all duration-200 hover:scale-110 text-5xl z-10";
      const selectedEffect = isSelected ? "scale-110" : "";
      
      if (color === 'w') {
        return `${baseClasses} ${selectedEffect} text-white filter`;
      } else {
        return `${baseClasses} ${selectedEffect} text-gray-900 filter`;
      }
    };

    // Additional styles for the wrapper div to create outlines
    const getWrapperStyles = () => {
      const baseShadow = isSelected 
        ? '0 0 10px rgba(255,215,0,0.8)' 
        : '0 0 2px rgba(0,0,0,0.7)';
        
      if (color === 'w') {
        return {
          textShadow: `-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 8px rgba(0,0,0,0.8)`,
          filter: `drop-shadow(${baseShadow})`,
          WebkitTextStroke: '1px black'
        };
      } else {
        return {
          textShadow: `-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 0 8px rgba(255,255,255,0.8)`,
          filter: `drop-shadow(${baseShadow})`,
          WebkitTextStroke: '1px white'
        };
      }
    };

    return (
      <div className={getPieceClasses()} style={getWrapperStyles()}>
        {piece}
      </div>
    );
  };
  
  const renderBoard = () => {
    const squares = [];
    const fenBoard = gameState.fen.split(' ')[0];
    const rows = fenBoard.split('/');
    const lastMove = gameState.lastMove;
    
    // These indices are used for visual rendering only
    const rowIndices = boardFlipped ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
    const colIndices = boardFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
    
    console.log("Board orientation - flipped:", boardFlipped);
    console.log("Row indices:", rowIndices);
    console.log("Col indices:", colIndices);
    
    for (const rowIndex of rowIndices) {
      let colPosition = 0;
      for (let i = 0; i < rows[rowIndex].length; i++) {
        const char = rows[rowIndex][i];
        if (isNaN(Number(char))) {
          // It's a piece
          const colIdx = colIndices[colPosition];
          
          // Calculate the actual algebraic position - this must be correct for chess.js
          // The algebraic notation stays consistent regardless of board orientation
          // This is why "e6" in notation corresponds to the correct square even when flipped
          const position = String.fromCharCode(97 + colIdx) + (8 - rowIndex);
          console.log(`Piece at visual row ${rowIndex}, col ${colIdx} => algebraic: ${position}, piece: ${char}`);
          
          const isBlack = (rowIndex + colIdx) % 2 !== 0;
          const color = char === char.toUpperCase() ? 'w' : 'b';
          const type = char.toLowerCase();
          const pieceSymbol = getPieceSymbol(color, type);
          const isSelected = selectedSquare === position;
          const isLegalMove = legalMoves.includes(position);
          const isLastMove = !!(lastMove && (lastMove.from === position || lastMove.to === position));
          
          squares.push(
            <div 
              key={position} 
              style={{ width: squareSize, height: squareSize }}
              data-position={position}
            >
              <Square 
                black={isBlack}
                piece={undefined} // We'll render the piece separately
                position={position}
                selected={isSelected}
                isLegalMove={isLegalMove}
                isLastMove={isLastMove}
                onClick={handleSquareClick}
              >
                <ChessPiece piece={pieceSymbol} color={color} isSelected={isSelected} />
              </Square>
            </div>
          );
          
          colPosition++;
        } else {
          // It's a number (empty squares)
          const count = parseInt(char);
          for (let j = 0; j < count; j++) {
            const colIdx = colIndices[colPosition];
            
            // Calculate the actual algebraic position
            const position = String.fromCharCode(97 + colIdx) + (8 - rowIndex);
            
            const isBlack = (rowIndex + colIdx) % 2 !== 0;
            const isSelected = selectedSquare === position;
            const isLegalMove = legalMoves.includes(position);
            const isLastMove = !!(lastMove && (lastMove.from === position || lastMove.to === position));
            
            squares.push(
              <div 
                key={position} 
                style={{ width: squareSize, height: squareSize }}
                data-position={position}
              >
                <Square 
                  black={isBlack}
                  position={position}
                  selected={isSelected}
                  isLegalMove={isLegalMove}
                  isLastMove={isLastMove}
                  onClick={handleSquareClick}
                />
              </div>
            );
            
            colPosition++;
          }
        }
      }
    }
    
    return squares;
  };
  
  // Render file (a-h) and rank (1-8) labels
  const renderBoardLabels = () => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const fileLabels = [];
    const rankLabels = [];
    
    // Files (columns)
    for (let i = 0; i < 8; i++) {
      const fileIndex = boardFlipped ? 7 - i : i;
      fileLabels.push(
        <div 
          key={`file-${i}`} 
          className="flex justify-center text-xs font-semibold text-gray-600"
          style={{ width: squareSize }}
        >
          {files[fileIndex]}
        </div>
      );
    }
    
    // Ranks (rows)
    for (let i = 0; i < 8; i++) {
      const rankIndex = boardFlipped ? i : 7 - i;
      rankLabels.push(
        <div 
          key={`rank-${i}`} 
          className="flex items-center justify-center text-xs font-semibold text-gray-600"
          style={{ height: squareSize }}
        >
          {ranks[rankIndex]}
        </div>
      );
    }
    
    return { fileLabels, rankLabels };
  };
  
  const { fileLabels, rankLabels } = renderBoardLabels();
  
  return (
    <div className="flex flex-col lg:flex-row items-start gap-8 p-4">
      <div className="flex flex-col items-center">
        <PlayerInfo 
          color="black"
          isActive={gameState.turn === 'b'}
          capturedPieces={gameState.capturedPieces.b}
        />
        
        <div className="flex mt-4 mb-2">
          <div className="mr-2 flex flex-col justify-around">
            {rankLabels}
          </div>
          
          <div>
            <div className="border-4 border-amber-600 rounded-sm shadow-lg">
              <div className="grid grid-cols-8 grid-rows-8" style={{ width, height: width }}>
                {renderBoard()}
              </div>
            </div>
            
            <div className="flex justify-around mt-1">
              {fileLabels}
            </div>
          </div>
        </div>
        
        <PlayerInfo 
          color="white"
          isActive={gameState.turn === 'w'}
          capturedPieces={gameState.capturedPieces.w}
        />
        
        <GameStatusIndicator gameState={gameState} />
        
        <GameControls 
          gameState={gameState} 
          onNewGame={handleNewGame} 
          onUndo={handleUndo}
          onFlipBoard={handleFlipBoard}
          onExportPGN={handleExportPGN}
          onExportFEN={handleExportFEN}
          onOfferDraw={handleOfferDraw}
          onResign={handleResign}
        />
      </div>

      <MoveHistory 
        history={gameState.history}
        onSelectMove={handleSelectMove}
        currentMoveIndex={currentMoveIndex !== null ? currentMoveIndex : undefined}
      />
    </div>
  );
};

export default ChessBoard; 