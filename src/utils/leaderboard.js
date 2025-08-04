const LEADERBOARD_KEY = "memoryGameLeaderboard";

// Get all scores from localStorage
export function getLeaderboard() {
  const data = localStorage.getItem(LEADERBOARD_KEY);
  return data ? JSON.parse(data) : [];
}

// Save a new score
export function saveScore(entry) {
  const leaderboard = getLeaderboard();

  leaderboard.push(entry);

  // Sort: fewest moves, then fastest time
  leaderboard.sort((a, b) => {
    if (a.moves === b.moves) return a.time - b.time;
    return a.moves - b.moves;
  });

  // Keep only top 10
  const top10 = leaderboard.slice(0, 10);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(top10));
}

// Clear the leaderboard
export function clearLeaderboard() {
  localStorage.removeItem(LEADERBOARD_KEY);
}
