// Main Bracket component, UI only, https://codepen.io/aronduby/pen/DRJrJN
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
    <main>
      <h2>{title}</h2>
      {/* First Round */}
      <ul className="round">
        <li className="spacer" />
        {firstRoundMatchups.map((matchup, idx) => (
          <React.Fragment key={idx}>
            <li className="game game-top">
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
            </li>
            <li className="game-spacer" />
            <li className="spacer" />
          </React.Fragment>
        ))}
      </ul>
      {/* Semifinals */}
      <ul className="round">
        <li className="spacer" />
        {[0, 1].map((semiIdx) => {
          const teamA = winners[semiIdx * 2];
          const teamB = winners[semiIdx * 2 + 1];
          return (
            <React.Fragment key={semiIdx}>
              <li className="game game-top">
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
              </li>
              <li className="game-spacer" />
              <li className="spacer" />
            </React.Fragment>
          );
        })}
      </ul>
      {/* Finals */}
      <ul className="round">
        <li className="spacer" />
        <li className="game game-top">
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
        </li>
        <li className="game-spacer" />
        <li className="spacer" />
      </ul>
      {/* Champion */}
      <ul className="round">
        <li className="spacer" />
        <li className="game game-top winner champion">
          <span>{final || "TBD"}</span>
        </li>
        <li className="spacer" />
      </ul>
      {editable && onSave && (
        <button className="save-button" onClick={onSave}>
          Save Bracket
        </button>
      )}
    </main>
  );
}

export default Bracket;