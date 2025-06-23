// Composes all hooks and UI components.

import React from "react";
import "../styles/index.css";
import "../styles/App.css";
import "../styles/Bracket.css";
import { useBracketLogic } from "../components/Bracket/BracketLogic";
import Bracket from "../components/Bracket/Bracket";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function BracketPage() {
  const {
    eastWinners, eastSemis, eastFinal,
    westWinners, westSemis, westFinal,
    overallChampion,
    simBracket, simWestBracket,
    eastFirstRoundMatchups, westFirstRoundMatchups,
    handleEastWinnerChange, handleEastSemiChange, handleEastFinalChange,
    handleWestWinnerChange, handleWestSemiChange, handleWestFinalChange,
    handleOverallChampionChange,
    simulateEastBracket, simulateWestBracket,
  } = useBracketLogic();

  // Save bracket to Firestore
  const saveBracket = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to save your bracket.");
      return;
    }
    const bracketData = {
      east: { winners: eastWinners, semis: eastSemis, final: eastFinal, timestamp: new Date() },
      west: { winners: westWinners, semis: westSemis, final: westFinal },
      overallChampion,
      timestamp: new Date(),
    };
    try {
      await setDoc(doc(db, "brackets", user.uid), bracketData);
      alert("Bracket saved!");
    } catch (error) {
      alert("Error saving bracket: " + error.message);
    }
  };

  return (
    <main style={{ flexDirection: "column", display: "flex", alignItems: "center" }}>
      {/* East Bracket */}
      <Bracket
        winners={eastWinners}
        semis={eastSemis}
        final={eastFinal}
        title="Your East Bracket"
        editable={true}
        firstRoundMatchups={eastFirstRoundMatchups}
        handleWinnerChange={handleEastWinnerChange}
        handleSemiChange={handleEastSemiChange}
        handleFinalChange={handleEastFinalChange}
        onSave={saveBracket}
      />
      <div style={{ margin: "2rem 0" }}>
        <button onClick={simulateEastBracket}>Simulate East Bracket</button>
      </div>
      {simBracket.final && (
        <Bracket
          winners={simBracket.winners}
          semis={simBracket.semis}
          final={simBracket.final}
          title="Simulated East Bracket"
          editable={false}
          firstRoundMatchups={eastFirstRoundMatchups}
        />
      )}

      {/* West Bracket */}
      <Bracket
        winners={westWinners}
        semis={westSemis}
        final={westFinal}
        title="Your West Bracket"
        editable={true}
        firstRoundMatchups={westFirstRoundMatchups}
        handleWinnerChange={handleWestWinnerChange}
        handleSemiChange={handleWestSemiChange}
        handleFinalChange={handleWestFinalChange}
        onSave={saveBracket}
      />
      <div style={{ margin: "2rem 0" }}>
        <button onClick={simulateWestBracket}>Simulate West Bracket</button>
      </div>
      {simWestBracket.final && (
        <Bracket
          winners={simWestBracket.winners}
          semis={simWestBracket.semis}
          final={simWestBracket.final}
          title="Simulated West Bracket"
          editable={false}
          firstRoundMatchups={westFirstRoundMatchups}
        />
      )}

      {/* Overall Final */}
      {eastFinal && westFinal && (
        <div className="overall-final">
          <h2>Championship: East vs West</h2>
          <select
            value={overallChampion}
            onChange={(e) => handleOverallChampionChange(e.target.value)}
          >
            <option value="">Select Champion</option>
            <option value={eastFinal}>{eastFinal} (East)</option>
            <option value={westFinal}>{westFinal} (West)</option>
          </select>
          {overallChampion && (
            <div className="champion-display">
              🏆 <strong>{overallChampion}</strong> is your champion!
            </div>
          )}
        </div>
      )}
    </main>
  );
}