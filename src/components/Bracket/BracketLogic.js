// All bracket log (state, handlers, simulation)

import { useState } from "react";

// Team and matchup data with ELO-style rankings
export const eastTeams = [
  { name: "1 Cavaliers", rank: 95, seed: 1 },
  { name: "2 Celtics", rank: 92, seed: 2 },
  { name: "3 Knicks", rank: 88, seed: 3 },
  { name: "4 Pacers", rank: 85, seed: 4 },
  { name: "5 Bucks", rank: 82, seed: 5 },
  { name: "6 Pistons", rank: 78, seed: 6 },
  { name: "7 Magic", rank: 75, seed: 7 },
  { name: "8 Heat", rank: 70, seed: 8 }
];

export const westTeams = [
  { name: "1 Thunder", rank: 96, seed: 1 },
  { name: "2 Rockets", rank: 90, seed: 2 },
  { name: "3 Lakers", rank: 87, seed: 3 },
  { name: "4 Nuggets", rank: 84, seed: 4 },
  { name: "5 Clippers", rank: 81, seed: 5 },
  { name: "6 Timberwolves", rank: 77, seed: 6 },
  { name: "7 Warriors", rank: 74, seed: 7 },
  { name: "8 Grizzlies", rank: 68, seed: 8 }
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
  const [simChampion, setSimChampion] = useState("");

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

  // ELO-based simulation functions
  function simulateRankedMatch(teamA, teamB) {
    // Get team objects from name strings
    const getTeamByName = (name) => {
      return [...eastTeams, ...westTeams].find(team => team.name === name);
    };

    const teamObjA = getTeamByName(teamA);
    const teamObjB = getTeamByName(teamB);

    // Fallback to basic comparison if team objects not found
    if (!teamObjA || !teamObjB) {
      const allTeams = [...eastTeams.map(t => t.name), ...westTeams.map(t => t.name)];
      return allTeams.indexOf(teamA) < allTeams.indexOf(teamB) ? teamA : teamB;
    }

    // Calculate win probability based on ELO rankings
    const total = teamObjA.rank + teamObjB.rank;
    const chanceA = teamObjA.rank / total;
    
    // Add some randomness - higher ranked team has better chance but upsets possible
    return Math.random() < chanceA ? teamA : teamB;
  }

  function findTeamsByNames(teamNames, teamArray) {
    return teamNames.map(name => teamArray.find(team => team.name === name) || { name, rank: 50 });
  }

  // Simulate East Bracket with ELO rankings
  const simulateEastBracket = () => {
    // First Round - use ELO-based simulation
    const firstRoundWinners = eastFirstRoundMatchups.map(([teamA, teamB]) =>
      simulateRankedMatch(teamA.name, teamB.name)
    );

    // Semifinals - simulate matches between winners
    const semiWinners = [0, 1].map((semiIdx) => {
      const teamA = firstRoundWinners[semiIdx * 2];
      const teamB = firstRoundWinners[semiIdx * 2 + 1];
      return simulateRankedMatch(teamA, teamB);
    });

    // Finals - simulate final match
    const finalWinner = simulateRankedMatch(semiWinners[0], semiWinners[1]);

    setSimBracket({
      winners: firstRoundWinners,
      semis: semiWinners,
      final: finalWinner,
    });
  };

  // Simulate West Bracket with ELO rankings
  const simulateWestBracket = () => {
    // First Round - use ELO-based simulation
    const firstRoundWinners = westFirstRoundMatchups.map(([teamA, teamB]) =>
      simulateRankedMatch(teamA.name, teamB.name)
    );

    // Semifinals - simulate matches between winners
    const semiWinners = [0, 1].map((semiIdx) => {
      const teamA = firstRoundWinners[semiIdx * 2];
      const teamB = firstRoundWinners[semiIdx * 2 + 1];
      return simulateRankedMatch(teamA, teamB);
    });

    // Finals - simulate final match
    const finalWinner = simulateRankedMatch(semiWinners[0], semiWinners[1]);

    setSimWestBracket({
      winners: firstRoundWinners,
      semis: semiWinners,
      final: finalWinner,
    });
  };

  // Simulate Championship with ELO rankings
  const simulateChampionship = () => {
    const eastWinner = simBracket.final;
    const westWinner = simWestBracket.final;
    
    if (eastWinner && westWinner) {
      const champion = simulateRankedMatch(eastWinner, westWinner);
      setSimChampion(champion);
    }
  };

  // Export everything needed by the UI
  return {
    // State
    eastWinners, eastSemis, eastFinal,
    westWinners, westSemis, westFinal,
    overallChampion,
    simBracket, simWestBracket, simChampion,

    // State setters (for loading saved brackets)
    setEastWinners, setEastSemis, setEastFinal,
    setWestWinners, setWestSemis, setWestFinal,
    setOverallChampion,

    // Data
    eastFirstRoundMatchups, westFirstRoundMatchups,

    // Handlers
    handleEastWinnerChange, handleEastSemiChange, handleEastFinalChange,
    handleWestWinnerChange, handleWestSemiChange, handleWestFinalChange,
    handleOverallChampionChange,

    // Simulation
    simulateEastBracket, simulateWestBracket, simulateChampionship,
  };
}