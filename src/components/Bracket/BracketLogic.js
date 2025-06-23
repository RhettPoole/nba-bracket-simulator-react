// All bracket log (state, handlers, simulation)

import { useState } from "react";

// Team and matchup data
export const eastTeams = [
  "1 Cavaliers", "2 Celtics", "3 Knicks", "4 Pacers",
  "5 Bucks", "6 Pistons", "7 Magic", "8 Heat"
];
export const westTeams = [
  "1 Thunder", "2 Rockets", "3 Lakers", "4 Nuggets",
  "5 Clippers", "6 Timberwolves", "7 Warriors", "8 Grizzlies"
];
export const eastFirstRoundMatchups = [
  [eastTeams[0], eastTeams[7]], // 1 vs 8
  [eastTeams[3], eastTeams[4]], // 4 vs 5
  [eastTeams[1], eastTeams[6]], // 2 vs 7
  [eastTeams[2], eastTeams[5]], // 3 vs 6
];
export const westFirstRoundMatchups = [
  [westTeams[0], westTeams[7]], // 1 vs 8
  [westTeams[3], westTeams[4]], // 4 vs 5
  [westTeams[1], westTeams[6]], // 2 vs 7
  [westTeams[2], westTeams[5]], // 3 vs 6
];

export function useBracketLogic() {
  // East state
  const [eastWinners, setEastWinners] = useState(Array(4).fill(""));
  const [eastSemis, setEastSemis] = useState(Array(2).fill(""));
  const [eastFinal, setEastFinal] = useState("");

  // West state
  const [westWinners, setWestWinners] = useState(Array(4).fill(""));
  const [westSemis, setWestSemis] = useState(Array(2).fill(""));
  const [westFinal, setWestFinal] = useState("");

  // Overall champion
  const [overallChampion, setOverallChampion] = useState("");

  // Simulated brackets (optional)
  const [simBracket, setSimBracket] = useState({
    winners: Array(4).fill(""),
    semis: Array(2).fill(""),
    final: "",
  });
  const [simWestBracket, setSimWestBracket] = useState({
    winners: Array(4).fill(""),
    semis: Array(2).fill(""),
    final: "",
  });

  // East handlers
  const handleEastWinnerChange = (idx, winner) => {
    const updated = [...eastWinners];
    updated[idx] = winner;
    setEastWinners(updated);
    setEastSemis(Array(2).fill(""));
    setEastFinal("");
    setOverallChampion("");
  };
  const handleEastSemiChange = (idx, winner) => {
    const updated = [...eastSemis];
    updated[idx] = winner;
    setEastSemis(updated);
    setEastFinal("");
    setOverallChampion("");
  };
  const handleEastFinalChange = (winner) => {
    setEastFinal(winner);
    setOverallChampion("");
  };

  // West handlers
  const handleWestWinnerChange = (idx, winner) => {
    const updated = [...westWinners];
    updated[idx] = winner;
    setWestWinners(updated);
    setWestSemis(Array(2).fill(""));
    setWestFinal("");
    setOverallChampion("");
  };
  const handleWestSemiChange = (idx, winner) => {
    const updated = [...westSemis];
    updated[idx] = winner;
    setWestSemis(updated);
    setWestFinal("");
    setOverallChampion("");
  };
  const handleWestFinalChange = (winner) => {
    setWestFinal(winner);
    setOverallChampion("");
  };

  // Overall champion handler
  const handleOverallChampionChange = (winner) => {
    setOverallChampion(winner);
  };

  // Simulate East Bracket
  const simulateEastBracket = () => {
    const firstRoundWinners = eastFirstRoundMatchups.map(([teamA, teamB]) =>
      eastTeams.indexOf(teamA) < eastTeams.indexOf(teamB) ? teamA : teamB
    );
    const semiWinners = [0, 1].map((semiIdx) => {
      const teamA = firstRoundWinners[semiIdx * 2];
      const teamB = firstRoundWinners[semiIdx * 2 + 1];
      return eastTeams.indexOf(teamA) < eastTeams.indexOf(teamB)
        ? teamA
        : teamB;
    });
    const finalWinner =
      eastTeams.indexOf(semiWinners[0]) < eastTeams.indexOf(semiWinners[1])
        ? semiWinners[0]
        : semiWinners[1];
    setSimBracket({
      winners: firstRoundWinners,
      semis: semiWinners,
      final: finalWinner,
    });
  };

  // Simulate West Bracket
  const simulateWestBracket = () => {
    const firstRoundWinners = westFirstRoundMatchups.map(([teamA, teamB]) =>
      westTeams.indexOf(teamA) < westTeams.indexOf(teamB) ? teamA : teamB
    );
    const semiWinners = [0, 1].map((semiIdx) => {
      const teamA = firstRoundWinners[semiIdx * 2];
      const teamB = firstRoundWinners[semiIdx * 2 + 1];
      return westTeams.indexOf(teamA) < westTeams.indexOf(teamB)
        ? teamA
        : teamB;
    });
    const finalWinner =
      westTeams.indexOf(semiWinners[0]) < westTeams.indexOf(semiWinners[1])
        ? semiWinners[0]
        : semiWinners[1];
    setSimWestBracket({
      winners: firstRoundWinners,
      semis: semiWinners,
      final: finalWinner,
    });
  };

  // Export everything needed by the UI
  return {
    // State
    eastWinners, eastSemis, eastFinal,
    westWinners, westSemis, westFinal,
    overallChampion,
    simBracket, simWestBracket,

    // Data
    eastFirstRoundMatchups, westFirstRoundMatchups,

    // Handlers
    handleEastWinnerChange, handleEastSemiChange, handleEastFinalChange,
    handleWestWinnerChange, handleWestSemiChange, handleWestFinalChange,
    handleOverallChampionChange,

    // Simulation
    simulateEastBracket, simulateWestBracket,
  };
}