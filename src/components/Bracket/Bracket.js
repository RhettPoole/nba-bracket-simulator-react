// Main Bracket component, UI only
import React from "react";
import "../../styles/Bracket.css";

export function Bracket({
  winners = [],
  semis = [],
  final = "",
  title = "",
  editable = false,
  firstRoundMatchups = [],
  handleWinnerChange = () => {},
  handleSemiChange = () => {},
  handleFinalChange = () => {},
  onSave,
}) {
  return (
    <div className="bracket-container">
      <h2>{title}</h2>
      {/* First Round */}
      <div className="column first-round">
        {firstRoundMatchups.map((matchup, idx) => (
          <div className="matchup" key={idx}>
            {editable ? (
              <select
                value={winners[idx] || ""}
                onChange={(e) => handleWinnerChange(idx, e.target.value)}
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
                  value={semis[semiIdx] || ""}
                  onChange={(e) => handleSemiChange(semiIdx, e.target.value)}
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
              value={final || ""}
              onChange={(e) => handleFinalChange(e.target.value)}
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
      {editable && onSave && (
        <button onClick={onSave} style={{ marginBottom: "1rem" }}>
          Save Bracket
        </button>
      )}
    </div>
  );
}

export default Bracket;