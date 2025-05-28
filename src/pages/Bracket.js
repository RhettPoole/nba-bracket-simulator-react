// This is our bracket logic page
// Import's React and useState hook. Required to define react components. The useState hook is a React function that allows use to add state to functional components - We can create and manage local state variables within a comonent and enable dynamic behavior.
import React, { useState } from "react";
import "../styles/index.css";
import "../styles/App.css";
import "../styles/Bracket.css";

// 8 East and 8 West teams, creating constants will make our brackets call from local data of teams to choose from.
const eastTeams = [
  "Bucks",
  "Pacers",
  "Pistons",
  "Knicks",
  "Celtics",
  "Heat",
  "Magic",
  "Cavaliers",
];
const westTeams = [
  "Clippers",
  "Nuggets",
  "Timberwolves",
  "Lakers",
  "Grizzlies",
  "Warriors",
  "Rockets",
  "Thunder",
];

// Start defining a React component (reusable piece of UI design and behavior) using an arrow function, same as a function declaration. Could use 'function Bracket() {}', arrow function accomplishes the same task.
const Bracket = () => {
  const [eastSelected, setEastSelected] = useState(Array(8).fill(""));
  const [westSelected, setWestSelected] = useState(Array(8).fill(""));

  // Defines a function inside of our bracket function to set east teams. takes two parameters, 'idx, team'.
  const handleEastChange = (idx, team) => {
    // Creates a shallow copy of the 'eastSelected' array
    const updated = [...eastSelected];
    // Updates an element at position 'idx' with a new 'team'
    updated[idx] = team;
    // Calls the setEastSelected function function to update the state with a new array.
    setEastSelected(updated);
  };

  const handleWestChange = (idx, team) => {
    const updated = [...westSelected];
    updated[idx] = team;
    setWestSelected(updated);
  };

  // Create matchups for each side
  // Create empty object/array for the matchups to interact with. We have to define the matchups, we already have the teams and bracket objects created, but we need the matchups now in a new array before we can start simulating outcomes.
  const eastMatchups = [];
  for (let i = 0; i < eastSelected.length; i += 2) {
    eastMatchups.push([eastSelected[i], eastSelected[i + 1]]);
  }
  const westMatchups = [];
  for (let i = 0; i < westSelected.length; i += 2) {
    westMatchups.push([westSelected[i], westSelected[i + 1]]);
  }

  // Define HTML layout
  return (
    <div className="bracket">
      <h1>NBA Playoff Bracket</h1>
      <div className="bracket-sides">
        {/*East Side */}
        <div className="bracket-side">
          <h2>East</h2>
          <div className="first-round">
            {eastSelected.map((team, idx) => (
              <div className="dropdown-wrapper" key={idx}>
                <select
                  value={team}
                  onChange={(e) => handleEastChange(idx, e.target.value)}
                  className="team-dropdown"
                >
                  <option value="">Select Team</option>
                  {eastTeams.map((t) => (
                    <option key = {t} value= {t}>
                        {t}
                    </option>
          ***REMOVED***)}
                </select>
                {/* Draw a line for every even index (start of a matchup) */}
                {idx % 2 === 0 && idx < eastSelected.length - 1 && (
                  <div className="bracket-line"></div>
        ***REMOVED***}
              </div>
    ***REMOVED***)}
          </div>
          <div className="matchups">
            {eastMatchups.map(([team1, team2], idx) => (
              <div key={idx} className="matchup">
                <span>{team1 || "TBD"}</span> vs <span>{team2 || "TBD"}</span>
              </div>
    ***REMOVED***)}
          </div>
        </div>
        {/* West Side */}
        <div className="bracket-side">
          <h2>West</h2>
          <div className="first-round">
            {westSelected.map((team, idx) => (
              <div className="dropdown-wrapper" key={idx}>
                <select
                  value={team}
                  onChange={(e) => handleWestChange(idx, e.target.value)}
                  className="team-dropdown"
                >
                  <option value="">Select Team</option>
                  {westTeams.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
          ***REMOVED***)}
                </select>
                {idx % 2 === 0 && idx < westSelected.length - 1 && (
                  <div className="bracket-line"></div>
        ***REMOVED***}
              </div>
    ***REMOVED***)}
          </div>
          <div className="matchups">
            {westMatchups.map(([team1, team2], idx) => (
              <div key={idx} className="matchup">
                <span>{team1 || "TBD"}</span> vs <span>{team2 || "TBD"}</span>
              </div>
    ***REMOVED***)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Start second round logic and design
// Create new constants for second round logic.
const[eastSecondRound, seteastSecondRound] = useState(Array(4).fill(""));
const[westSecondRound, setWestSecondRound] = useState(Array(4).fill(""));


export default Bracket;
