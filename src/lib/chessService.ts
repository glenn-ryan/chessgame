import { Chess, Move, Square } from 'chess.js';

export interface ChessGameState {
  fen: string;
  turn: 'w' | 'b';
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  isThreefoldRepetition: boolean;
  isInsufficientMaterial: boolean;
  is50MovesRule: boolean;
  isGameOver: boolean;
  history: Move[];
  capturedPieces: {
    w: string[];
    b: string[];
  };
  moveCount: number;
  lastMove: Move | null;
}

export class ChessService {
  private game: Chess;
  private capturedPieces: {
    w: string[];
    b: string[];
  };

  constructor(fen?: string) {
    this.game = new Chess(fen);
    this.capturedPieces = {
      w: [],
      b: []
    };
  }

  public getGameState(): ChessGameState {
    const history = this.game.history({ verbose: true });
    console.log("Full move history:", JSON.stringify(history));
    
    return {
      fen: this.game.fen(),
      turn: this.game.turn() as 'w' | 'b',
      isCheck: this.game.isCheck(),
      isCheckmate: this.game.isCheckmate(),
      isStalemate: this.game.isStalemate(),
      isDraw: this.game.isDraw(),
      isThreefoldRepetition: this.game.isThreefoldRepetition(),
      isInsufficientMaterial: this.game.isInsufficientMaterial(),
      is50MovesRule: this.checkIs50MovesRule(),
      isGameOver: this.game.isGameOver(),
      history: history,
      capturedPieces: this.capturedPieces,
      moveCount: Math.floor(this.game.history().length / 2) + (this.game.turn() === 'b' ? 1 : 0),
      lastMove: this.getLastMove()
    };
  }

  public makeMove(from: string, to: string, promotion?: 'n' | 'b' | 'r' | 'q'): boolean {
    try {
      console.log(`ChessService.makeMove from ${from} to ${to}`);
      const move = this.game.move({
        from,
        to,
        promotion: promotion || 'q' // Default to queen promotion
      });
      
      if (move) {
        console.log(`Move successful:`, JSON.stringify(move));
        console.log(`Move from: ${move.from}, to: ${move.to}, SAN: ${move.san}`);
        // Verify the full history after the move
        const history = this.game.history({ verbose: true });
        console.log(`Latest move in history:`, JSON.stringify(history[history.length - 1]));
        
        // Track captured pieces
        if (move.captured) {
          const capturedColor = move.color === 'w' ? 'b' : 'w';
          const pieceSymbol = capturedColor === 'w' 
            ? move.captured.toUpperCase() 
            : move.captured;
          this.capturedPieces[capturedColor].push(pieceSymbol);
        }
        
        return true;
      }
      
      console.log(`Move failed`);
      return false;
    } catch (_) {
      console.error(`Exception in makeMove`);
      return false;
    }
  }

  public undo(): boolean {
    try {
      const move = this.game.undo();
      
      if (move && move.captured) {
        // Remove the last captured piece if this move had a capture
        const capturedColor = move.color === 'w' ? 'b' : 'w';
        this.capturedPieces[capturedColor].pop();
      }
      
      return !!move;
    } catch (_) {
      return false;
    }
  }

  public reset(): void {
    this.game.reset();
    this.capturedPieces = {
      w: [],
      b: []
    };
  }

  public loadFen(fen: string): boolean {
    try {
      // Create a new Chess instance with the provided FEN
      const newGame = new Chess(fen);
      // If we got here, the FEN is valid, so replace the current game
      this.game = newGame;
      // Reset captured pieces since we're loading a new position
      this.capturedPieces = {
        w: [],
        b: []
      };
      return true;
    } catch (_) {
      return false;
    }
  }

  public getLegalMoves(square: string): string[] {
    try {
      console.log(`Getting legal moves for square: ${square}`);
      const moves = this.game.moves({
        square: square as Square,
        verbose: true
      }) as Move[];
      
      const destinations = moves.map(move => move.to);
      console.log(`Legal destinations: ${JSON.stringify(destinations)}`);
      return destinations;
    } catch (_) {
      console.error(`Exception in getLegalMoves`);
      return [];
    }
  }

  private getLastMove(): Move | null {
    const history = this.game.history({ verbose: true });
    return history.length > 0 ? history[history.length - 1] : null;
  }

  private checkIs50MovesRule(): boolean {
    // Check for fifty moves rule by inspecting the FEN
    const fenParts = this.game.fen().split(' ');
    // Half-move clock is the 5th field in the FEN
    const halfMoveClock = parseInt(fenParts[4], 10);
    return halfMoveClock >= 100; // 50 full moves = 100 half moves
  }
}

export default ChessService; 