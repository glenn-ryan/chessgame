# Chess Game - Next.js TypeScript Application

A fully-functional chess game built with Next.js, TypeScript, and Tailwind CSS. This application allows users to play chess against another player locally with proper move validation and game state management.

## Features

- Full chess game implementation with standard rules
- Valid move highlighting
- Game state tracking (check, checkmate, draw detection)
- Move history display
- Undo move functionality
- Responsive design

## Technology Stack

- **Next.js** - React framework for building the UI and handling routing
- **TypeScript** - For type safety and better developer experience
- **Tailwind CSS** - For styling components
- **chess.js** - For chess move validation and game state management

## Project Structure

```
/chess-game
  /src
    /app           # Next.js app directory
    /components    # React components
      /chessboard  # Chess-specific components
    /lib           # Utility functions and service classes
    /styles        # Global styles
  /public          # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Play

1. Click on a piece to select it
2. Green highlights will appear showing valid move destinations
3. Click on a highlighted square to move the piece
4. Use the "New Game" button to reset the board
5. Use the "Undo Move" button to take back a move

## Future Enhancements

- Computer AI opponent
- Online multiplayer
- Game saving and loading
- Customizable board themes
- Chess puzzles and challenges

## License

This project is licensed under the MIT License - see the LICENSE file for details.
