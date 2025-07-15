// Composes all hooks and UI components.

import React, { useState, useEffect } from "react";
import "../styles/index.css";
import "../styles/App.css";
import "../styles/Bracket.css";
import { useBracketLogic } from "../components/Bracket/BracketLogic";
import Bracket from "../components/Bracket/Bracket";
import { db } from "../firebase";
import { doc, setDoc, collection, getDocs, getDoc, deleteDoc } from "firebase/firestore";
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
    // State setters for loading saved brackets
    setEastWinners, setEastSemis, setEastFinal,
    setWestWinners, setWestSemis, setWestFinal,
    setOverallChampion,
  } = useBracketLogic();

  // Bracket management state
  const [bracketName, setBracketName] = useState("");
  const [userBrackets, setUserBrackets] = useState([]); // [{id, name, data}]
  const [selectedBracketId, setSelectedBracketId] = useState("");

  // Fetch all brackets for the user
  useEffect(() => {
    const fetchBrackets = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      try {
        const bracketsCol = collection(db, "users", user.uid, "brackets");
        const snap = await getDocs(bracketsCol);
        setUserBrackets(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching brackets:", error);
      }
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
      const bracketId = selectedBracketId || bracketName.replace(/\s+/g, '-').toLowerCase();
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
    if (!bracketId) return;
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    try {
      const bracketDoc = await getDoc(doc(db, "users", user.uid, "brackets", bracketId));
      if (bracketDoc.exists()) {
        const data = bracketDoc.data();
        setBracketName(data.name || "");
        setSelectedBracketId(bracketId);
        setEastWinners(data.east?.winners || Array(4).fill(""));
        setEastSemis(data.east?.semis || Array(2).fill(""));
        setEastFinal(data.east?.final || "");
        setWestWinners(data.west?.winners || Array(4).fill(""));
        setWestSemis(data.west?.semis || Array(2).fill(""));
        setWestFinal(data.west?.final || "");
        setOverallChampion(data.overallChampion || "");
      }
    } catch (error) {
      alert("Error loading bracket: " + error.message);
    }
  };

  // Delete a bracket
  const deleteBracket = async (bracketId) => {
    if (!bracketId) return;
    
    const confirmDelete = window.confirm("Are you sure you want to delete this bracket? This action cannot be undone.");
    if (!confirmDelete) return;

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      await deleteDoc(doc(db, "users", user.uid, "brackets", bracketId));
      alert("Bracket deleted!");
      
      // Clear current bracket if it was the one being deleted
      if (selectedBracketId === bracketId) {
        createNewBracket();
      }
      
      // Refresh bracket list
      const bracketsCol = collection(db, "users", user.uid, "brackets");
      const snap = await getDocs(bracketsCol);
      setUserBrackets(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      alert("Error deleting bracket: " + error.message);
    }
  };

  // Create new bracket
  const createNewBracket = () => {
    setBracketName("");
    setSelectedBracketId("");
    setEastWinners(Array(4).fill(""));
    setEastSemis(Array(2).fill(""));
    setEastFinal("");
    setWestWinners(Array(4).fill(""));
    setWestSemis(Array(2).fill(""));
    setWestFinal("");
    setOverallChampion("");
  };

  return (
    <main style={{ 
      flexDirection: "column", 
      display: "flex", 
      alignItems: "center",
      background: "linear-gradient(135deg, #f4f7fa 0%, #e9ecef 100%)",
      minHeight: "100vh",
      padding: "20px 0"
    }}>
      {/* Bracket Management */}
      <div style={{ 
        margin: "1rem 0", 
        padding: "2rem", 
        border: "none", 
        borderRadius: "16px", 
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        maxWidth: "900px",
        width: "100%"
      }}>
        <h3 style={{ 
          margin: "0 0 1.5rem 0", 
          color: "#222", 
          fontSize: "1.5rem", 
          fontWeight: "600",
          textAlign: "center"
        }}>
          Bracket Management
        </h3>
        <div style={{ 
          display: "flex", 
          gap: "12px", 
          alignItems: "center", 
          flexWrap: "wrap",
          justifyContent: "center"
        }}>
          <input
            type="text"
            placeholder="Enter bracket name..."
            value={bracketName}
            onChange={(e) => setBracketName(e.target.value)}
            style={{ 
              padding: "12px 16px", 
              borderRadius: "8px", 
              border: "2px solid #ccc", 
              minWidth: "220px",
              fontSize: "14px",
              outline: "none",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
            onFocus={(e) => e.target.style.borderColor = "rgb(218, 0, 0)"}
            onBlur={(e) => e.target.style.borderColor = "#ccc"}
          />
          <button 
            onClick={saveBracket}
            style={{ 
              padding: "12px 24px", 
              backgroundColor: "green", 
              color: "white", 
              border: "none", 
              borderRadius: "8px", 
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(218, 0, 0, 0.3)"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "darkgreen"}
            onMouseOut={(e) => e.target.style.backgroundColor = "green"}
          >
            Save Bracket
          </button>
          <button 
            onClick={createNewBracket}
            style={{ 
              padding: "12px 24px", 
              backgroundColor: "#222", 
              color: "white", 
              border: "none", 
              borderRadius: "8px", 
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(34, 34, 34, 0.3)"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#444"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#222"}
          >
            New Bracket
          </button>
          <select
            value={selectedBracketId}
            onChange={(e) => loadBracket(e.target.value)}
            style={{ 
              padding: "12px 16px", 
              borderRadius: "8px", 
              border: "2px solid #ccc", 
              minWidth: "220px",
              fontSize: "14px",
              outline: "none",
              cursor: "pointer",
              backgroundColor: "white",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            <option value="">Select saved bracket...</option>
            {userBrackets.map(bracket => (
              <option key={bracket.id} value={bracket.id}>
                {bracket.name} ({new Date(bracket.timestamp?.seconds * 1000).toLocaleDateString()})
              </option>
            ))}
          </select>
          {selectedBracketId && (
            <button 
              onClick={() => deleteBracket(selectedBracketId)}
              style={{ 
                padding: "12px 24px", 
                backgroundColor: "rgb(218, 0, 0)", 
                color: "white", 
                border: "none", 
                borderRadius: "8px", 
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(218, 0, 0, 0.3)"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "rgb(153, 1, 1)"}
              onMouseOut={(e) => e.target.style.backgroundColor = "rgb(218, 0, 0)"}              >
                Delete Bracket
              </button>
          )}
        </div>
        {selectedBracketId && (
          <div style={{ 
            marginTop: "16px", 
            fontSize: "14px", 
            color: "#666",
            textAlign: "center",
            padding: "12px",
            backgroundColor: "rgba(34, 34, 34, 0.1)",
            borderRadius: "8px",
            border: "1px solid rgba(34, 34, 34, 0.2)"
          }}>
            Currently editing: <strong style={{ color: "#222" }}>{bracketName}</strong>
          </div>
        )}
      </div>
      {/* East Bracket */}
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "16px",
        padding: "2rem",
        margin: "1rem 0",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        maxWidth: "1200px",
        width: "100%"
      }}>
        <h2 style={{ 
          textAlign: "center", 
          color: "#222", 
          marginBottom: "1.5rem",
          fontSize: "1.8rem",
          fontWeight: "700"
        }}>
          Eastern Conference
        </h2>
        <Bracket
          winners={eastWinners}
          semis={eastSemis}
          final={eastFinal}
          title=""
          editable={true}
          firstRoundMatchups={eastFirstRoundMatchups}
          handleWinnerChange={handleEastWinnerChange}
          handleSemiChange={handleEastSemiChange}
          handleFinalChange={handleEastFinalChange}
        />
        <div style={{ margin: "2rem 0", textAlign: "center" }}>
          <button 
            onClick={simulateEastBracket}
            style={{
              padding: "12px 32px",
              backgroundColor: "#666",
              color: "white",
              border: "none",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(102, 102, 102, 0.3)"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#555"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#666"}
          >
            Simulate East Bracket
          </button>
        </div>
      </div>
      {simBracket.final && (
        <div style={{
          backgroundColor: "rgba(102, 102, 102, 0.1)",
          borderRadius: "16px",
          padding: "2rem",
          margin: "1rem 0",
          border: "2px solid rgba(102, 102, 102, 0.3)",
          maxWidth: "1200px",
          width: "100%"
        }}>
          <h3 style={{ 
            textAlign: "center", 
            color: "#666", 
            marginBottom: "1.5rem",
            fontSize: "1.4rem",
            fontWeight: "600"
          }}>
            Simulated East Bracket
          </h3>
          <Bracket
            winners={simBracket.winners}
            semis={simBracket.semis}
            final={simBracket.final}
            title=""
            editable={false}
            firstRoundMatchups={eastFirstRoundMatchups}
          />
        </div>
      )}

      {/* West Bracket */}
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "16px",
        padding: "2rem",
        margin: "1rem 0",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        maxWidth: "1200px",
        width: "100%"
      }}>
        <h2 style={{ 
          textAlign: "center", 
          color: "#222", 
          marginBottom: "1.5rem",
          fontSize: "1.8rem",
          fontWeight: "700"
        }}>
          Western Conference
        </h2>
        <Bracket
          winners={westWinners}
          semis={westSemis}
          final={westFinal}
          title=""
          editable={true}
          firstRoundMatchups={westFirstRoundMatchups}
          handleWinnerChange={handleWestWinnerChange}
          handleSemiChange={handleWestSemiChange}
          handleFinalChange={handleWestFinalChange}
        />
        <div style={{ margin: "2rem 0", textAlign: "center" }}>
          <button 
            onClick={simulateWestBracket}
            style={{
              padding: "12px 32px",
              backgroundColor: "#888",
              color: "white",
              border: "none",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(136, 136, 136, 0.3)"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#777"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#888"}
          >
            Simulate West Bracket
          </button>
        </div>
      </div>
      {simWestBracket.final && (
        <div style={{
          backgroundColor: "rgba(136, 136, 136, 0.1)",
          borderRadius: "16px",
          padding: "2rem",
          margin: "1rem 0",
          border: "2px solid rgba(136, 136, 136, 0.3)",
          maxWidth: "1200px",
          width: "100%"
        }}>
          <h3 style={{ 
            textAlign: "center", 
            color: "#888", 
            marginBottom: "1.5rem",
            fontSize: "1.4rem",
            fontWeight: "600"
          }}>
            Simulated West Bracket
          </h3>
          <Bracket
            winners={simWestBracket.winners}
            semis={simWestBracket.semis}
            final={simWestBracket.final}
            title=""
            editable={false}
            firstRoundMatchups={westFirstRoundMatchups}
          />
        </div>
      )}

      {/* Overall Final */}
      {eastFinal && westFinal && (
        <div style={{
          backgroundColor: "rgba(218, 0, 0, 0.15)",
          borderRadius: "20px",
          padding: "3rem",
          margin: "2rem 0",
          border: "3px solid rgba(218, 0, 0, 0.5)",
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 12px 40px rgba(218, 0, 0, 0.2)"
        }}>
          <h2 style={{ 
            color: "#222", 
            marginBottom: "2rem",
            fontSize: "2.2rem",
            fontWeight: "800",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
          }}>
             Championship Final
          </h2>
          <div style={{ marginBottom: "2rem" }}>
            <div style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: "1.5rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              border: "2px solid rgba(255, 215, 0, 0.3)"
            }}>
              <h3 style={{ color: "#2c3e50", marginBottom: "1rem", fontSize: "1.4rem" }}>
                East vs West Championship
              </h3>
              <select
                value={overallChampion}
                onChange={(e) => handleOverallChampionChange(e.target.value)}
                style={{
                  padding: "12px 20px",
                  borderRadius: "8px",
                  border: "2px solid #ffd700",
                  fontSize: "16px",
                  fontWeight: "600",
                  backgroundColor: "white",
                  color: "#2c3e50",
                  cursor: "pointer",
                  minWidth: "300px",
                  outline: "none"
                }}
              >
                <option value=""> Select Champion</option>
                <option value={eastFinal}> {eastFinal} (East)</option>
                <option value={westFinal}> {westFinal} (West)</option>
              </select>
            </div>
          </div>
          {overallChampion && (
            <div style={{
              backgroundColor: "rgba(255, 215, 0, 0.3)",
              padding: "2rem",
              borderRadius: "16px",
              border: "2px solid #ffd700",
              animation: "pulse 2s infinite"
            }}>
              <div style={{ 
                fontSize: "3rem", 
                marginBottom: "1rem"
              }}>
                
              </div>
              <div style={{
                fontSize: "1.8rem",
                fontWeight: "800",
                color: "#b8860b",
                textShadow: "2px 2px 4px rgba(0,0,0,0.2)"
              }}>
               🏆 <strong>{overallChampion}</strong>
              </div>
              <div style={{
                fontSize: "1.2rem",
                color: "#d4af37",
                marginTop: "0.5rem",
                fontWeight: "600"
              }}>
                is your champion! 
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}