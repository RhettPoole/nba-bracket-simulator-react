// Composes all hooks and UI components.

import React, { useState, useEffect } from "react";
import "../styles/index.css";
import "../styles/App.css";
import "../styles/Bracket.css";
import { useBracketLogic } from "../components/Bracket/BracketLogic";
import Bracket from "../components/Bracket/Bracket";
import { db } from "../firebase";
import { doc, setDoc, collection, getDocs, getDoc } from "firebase/firestore";
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

  const [bracketName, setBracketName] = useState("");
  const [userBrackets, setUserBrackets] = useState([]); // [{id, name, data}]
  const [selectedBracketId, setSelectedBracketId] = useState("");

  // Fetch all brackets for the user
  useEffect(() => {
    const fetchBrackets = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      const bracketsCol = collection(db, "users", user.uid, "brackets");
      const snap = await getDocs(bracketsCol);
      setUserBrackets(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchBrackets();
  }, []);

  // Save bracket to Firestore (new or update)
  const saveBracket = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to save your bracket.");
      return;
    }
    if (!bracketName) {
      alert("Please enter a bracket name.");
      return;
    }
    const bracketData = {
      name: bracketName,
      east: { winners: eastWinners, semis: eastSemis, final: eastFinal },
      west: { winners: westWinners, semis: westSemis, final: westFinal },
      overallChampion,
      timestamp: new Date(),
    };
    try {
      const bracketId = selectedBracketId || bracketName;
      await setDoc(doc(db, "users", user.uid, "brackets", bracketId), bracketData);
      alert("Bracket saved!");
      setSelectedBracketId(bracketId);
      // Refresh bracket list
      const bracketsCol = collection(db, "users", user.uid, "brackets");
      const snap = await getDocs(bracketsCol);
      setUserBrackets(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      alert("Error saving bracket: " + error.message);
    }
  };

  // Load a bracket by id
  const loadBracket = async (bracketId) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    const bracketDoc = await getDoc(doc(db, "users", user.uid, "brackets", bracketId));
    if (bracketDoc.exists()) {
      const data = bracketDoc.data();
      setBracketName(data.name || "");
      setSelectedBracketId(bracketId);
      setEastWinners(data.east.winners || Array(4).fill(""));
      setEastSemis(data.east.semis || Array(2).fill(""));
      setEastFinal(data.east.final || "");
      setWestWinners(data.west.winners || Array(4).fill(""));
      setWestSemis(data.west.semis || Array(2).fill(""));
      setWestFinal(data.west.final || "");
      setOverallChampion(data.overallChampion || "");
    }
  };

  return (
    <main style={{ flexDirection: "column", display: "flex", alignItems: "center" }}>
      {/* Bracket selection and naming */}
      <div style={{ margin: "1rem 0" }}>
        <input
          type="text"
          placeholder="Bracket Name"
          value={bracketName}
          onChange={e => setBracketName(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={() => { setBracketName(""); setSelectedBracketId(""); setEastWinners(Array(4).fill("")); setEastSemis(Array(2).fill("")); setEastFinal(""); setWestWinners(Array(4).fill("")); setWestSemis(Array(2).fill("")); setWestFinal(""); setOverallChampion(""); }}>New Bracket</button>
        <select
          value={selectedBracketId}
          onChange={e => loadBracket(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          <option value="">Select Saved Bracket</option>
          {userBrackets.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

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