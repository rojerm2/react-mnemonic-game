import { useEffect, useState } from "react";
import { saveScore } from './utils/leaderboard';
import Leaderboard from './components/Leaderboard'; // Adjust path as needed

import "./App.css";

function App() {
  const flipSound = new Audio("/sounds/flip.mp3");
  const matchSound = new Audio("/sounds/match.mp3");
  const winSound = new Audio("/sounds/win.mp3");
  
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gridSize, setGridSize] = useState(4); // 4x3 default
  const [refreshKey, setRefreshKey] = useState(0);


  // Shuffle and setup cards
  const initializeGame = (size = gridSize) => {
    const pairCount = (size * 3) / 2; // 3x4, 4x4, etc.
    const emojiSet = getEmojiSet(pairCount);
    const shuffled = [...emojiSet, ...emojiSet]
      .sort(() => 0.5 - Math.random())
      .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }));
    
    setCards(shuffled);
    setGridSize(size);
    setFlippedCards([]);
    setMoves(0);
    setTime(0);
    setIsRunning(true);
  };

  const getEmojiSet = (count) => {
    const all = ["🐶", "🐱", "🐰", "🦊", "🐻", "🐼", "🦁", "🐸", "🐵", "🐮"];
    return all.slice(0, count);
  };


  useEffect(() => {
    initializeGame(3);
  }, []);

  // Timer
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  // Matching logic
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = flippedCards;
      if (cards[first].emoji === cards[second].emoji) {
        matchSound.play();
        setCards((prev) =>
          prev.map((card, index) =>
            index === first || index === second
              ? { ...card, matched: true }
              : card
          )
        );
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, index) =>
              index === first || index === second
                ? { ...card, flipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards]);

  // Check win condition
  useEffect(() => {
    if (cards.length && cards.every((card) => card.matched)) {
      setIsRunning(false);
      winSound.play();
      onGameComplete(moves, time);
    }
  }, [cards]);

  const handleClick = (index) => {
    if (
      flippedCards.length < 2 &&
      !cards[index].flipped &&
      !cards[index].matched
    ) {
      setCards((prev) =>
        prev.map((card, i) => (i === index ? { ...card, flipped: true } : card))
      );
      setFlippedCards((prev) => [...prev, index]);
      flipSound.play();
    }
  };

  function onGameComplete(moves, timeInSeconds) {
    const name = prompt("Enter your name:");
    if (!name) return;

    const score = {
      name,
      moves,
      time: timeInSeconds,
    };

    saveScore(score);
    setRefreshKey(prev => prev + 1); // Force refresh
  }


  return (
    <div className="App">
      <h1>🧠 Memory Game</h1>

      <div className="stats">
        <span>⏱️ Time: {time}s</span>
        <span>🎯 Moves: {moves}</span>
      </div>

      <button onClick={() => initializeGame(4)}>🔄 Restart</button>

      <div className="difficulty">
        <h3>🎮 Select Difficulty</h3>
        <div className="difficulty-buttons">
          <button onClick={() => initializeGame(4)}>🟢 Easy (3x4)</button>
          <button onClick={() => initializeGame(6)}>🟡 Medium (4x4)</button>
          <button onClick={() => initializeGame(8)}>🔴 Hard (6x4)</button>
        </div>
      </div>

      <div className="grid">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card ${card.flipped || card.matched ? "flipped" : ""}`}
            onClick={() => handleClick(index)}
          >
            {card.flipped || card.matched ? card.emoji : "❓"}
          </div>
        ))}
      </div>

      {!isRunning && cards.every((c) => c.matched) && (
        <p className="message">
          🎉 You won in {moves} moves and {time} seconds!
        </p>
      )}

      <Leaderboard refreshKey={refreshKey} />

    </div>
  );
}

export default App;
