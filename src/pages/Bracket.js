import React, { useState } from "react";
import "../styles/index.css";
import "../styles/App.css";
import "../styles/Bracket.css";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const eastTeams = [
  "1 Cavaliers",
  "7 Magic",
  "3 Knicks",
  "4 Pacers",
  "2 Celtics",
  "8 Heat",
  "5 Bucks",
  "6 Pistons",
];

const eastFirstRoundMatchups = [
  [eastTeams[0], eastTeams[5]], // 1 vs 8
  [eastTeams[3], eastTeams[6]], // 4 vs 5
  [eastTeams[4], eastTeams[1]], // 2 vs 7
  [eastTeams[2], eastTeams[7]], // 3 vs 6
];

const Bracket = () => {
  const [eastWinners, setEastWinners] = useState(Array(4).fill(""));
  const [eastSemis, setEastSemis] = useState(Array(2).fill(""));
  const [eastFinal, setEastFinal] = useState("");
  const [simBracket, setSimBracket] = useState({
    winners: Array(4).fill(""),
    semis: Array(2).fill(""),
    final: "",
  });
  
  const saveBracket = async () => {
  const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to save your bracket.");
        return;
      }

      const bracketData = {
        winners: eastWinners,
        semis: eastSemis,
        final: eastFinal,
        timestamp: new Date(),
      };

      try {
        await setDoc(doc(db, "brackets", user.uid), bracketData);
        alert("Bracket saved!");
      } catch (error) {
        alert("Error saving bracket: " + error.message);
      }
    };

  const handleEastWinnerChange = (matchupIdx, winner) => {
    const updated = [...eastWinners];
    updated[matchupIdx] = winner;
    setEastWinners(updated);
    setEastSemis(Array(2).fill(""));
    setEastFinal("");
  };

  const handleEastSemiChange = (semiIdx, winner) => {
    const updated = [...eastSemis];
    updated[semiIdx] = winner;
    setEastSemis(updated);
    setEastFinal("");
  };

  const handleEastFinalChange = (winner) => {
    setEastFinal(winner);
  };

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

  const renderBracket = (winners, semis, final, label, editable = false) => (
    <div className="bracket">
      <h3 style={{ textAlign: "center", width: "100%" }}>{label}</h3>

      {/* First Round */}
      <div className="column first-round">
        {eastFirstRoundMatchups.map((matchup, idx) => (
          <div className="matchup" key={idx}>
            {editable ? (
              <select
                value={winners[idx]}
                onChange={(e) => handleEastWinnerChange(idx, e.target.value)}
              >
                <option value="">Select</option>
                <option value={matchup[0]}>{matchup[0]}</option>
                <option value={matchup[1]}>{matchup[1]}</option>
              </select>
            ) : (
              <span>{winners[idx] || `${matchup[0]} / ${matchup[1]}`}</span>
            )}
          </div>
        ))}
      </div>

      {/* Semifinals */}
      <div className="column semifinals">
        {[0, 1].map((semiIdx) => {
          const teamA = winners[semiIdx * 2];
          const teamB = winners[semiIdx * 2 + 1];
          return (
            <div className="matchup" key={semiIdx}>
              {editable ? (
                <select
                  value={semis[semiIdx]}
                  onChange={(e) =>
                    handleEastSemiChange(semiIdx, e.target.value)
                  }
                  disabled={!teamA || !teamB}
                >
                  <option value="">Select</option>
                  {teamA && <option value={teamA}>{teamA}</option>}
                  {teamB && <option value={teamB}>{teamB}</option>}
                </select>
              ) : (
                <span>
                  {semis[semiIdx] || `${teamA || "?"} / ${teamB || "?"}`}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Finals */}
      <div className="column finals">
        <div className="matchup">
          {editable ? (
            <select
              value={final}
              onChange={(e) => handleEastFinalChange(e.target.value)}
              disabled={!semis[0] || !semis[1]}
            >
              <option value="">Select</option>
              {semis[0] && <option value={semis[0]}>{semis[0]}</option>}
              {semis[1] && <option value={semis[1]}>{semis[1]}</option>}
            </select>
          ) : (
            <span>{final || `${semis[0] || "?"} / ${semis[1] || "?"}`}</span>
          )}
        </div>
      </div>

      {/* Champion */}
      <div className="column champion">
        <div className="matchup champion">🏆 {final || "TBD"}</div>
      </div>
      <button onClick={saveBracket} style={{ marginBottom: "1rem" }}>
        Save Bracket
      </button>
    </div>
  );

  return (
    <main
      style={{ flexDirection: "column", display: "flex", alignItems: "center" }}
    >
      {renderBracket(eastWinners, eastSemis, eastFinal, "Your Bracket", true)}
      <div style={{ margin: "2rem 0" }}>
        <button onClick={simulateEastBracket}>Simulate East Bracket</button>
      </div>
      {simBracket.final &&
        renderBracket(
          simBracket.winners,
          simBracket.semis,
          simBracket.final,
          "Simulated Bracket"
        )}
    </main>
  );
};

export default Bracket;
