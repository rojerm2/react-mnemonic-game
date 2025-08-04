import React, { useEffect, useState } from 'react';
import { getLeaderboard, clearLeaderboard } from '../utils/leaderboard';
import './Leaderboard.css';

export default function Leaderboard({ refreshKey }) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    setScores(getLeaderboard());
  }, [refreshKey]); // Re-run this effect when refreshKey changes

  const handleClear = () => {
    if (window.confirm("Clear all scores?")) {
      clearLeaderboard();
      setScores([]);
    }
  };

  return (
    <div className="leaderboard p-4">
      <h2 className="text-xl font-bold mb-2">🏆 Leaderboard</h2>
      {scores.length === 0 ? (
        <p>No scores yet.</p>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">#</th>
              <th className="text-left">Name</th>
              <th>Moves</th>
              <th>Time (s)</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{score.name}</td>
                <td className="text-center">{score.moves}</td>
                <td className="text-center">{score.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {scores.length > 0 && (
        <button
          onClick={handleClear}
          className="mt-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Clear Leaderboard
        </button>
      )}
    </div>
  );
}
