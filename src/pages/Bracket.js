// This is our bracket logic page

import React, { useState } from 'react';
import '../styles/index.css';
import '../styles/App.css'

const teamsList = [
    // 16 teams in the first round of NBA playoffs
    'Bucks',
    'Pacers',
    'Clippers',
    'Nuggets',
    'Pistons',
    'Knicks',
    'Timberwolves',
    'Lakers',
    'Grizzlies',
    'Heat',
    'Celtics',
    'Magic',
    'Warriors',
    'Rockets',
    'Thunder',
    'Cavaliers',
]

const Bracket = () => {
    // UseState hook manages the array selectedTeams. selectedTeams is initialized as an array of 16 empty strings.
    const [selectedTeams, setSelectedTeams] = useState(Array(16).fill(''));

    // Updates the selectedTeams array when a team is selected at a specific index.
    const handleTeamChange = (index, team) => {
        const updatedTeams = [...selectedTeams];
        updatedTeams[index] = team;
        setSelectedTeams(updatedTeams);
    }

    // 8 matchups in the first round for all 16 teams
    const matchups = []
    // Loops through selectedTeams in a pair of 'matchups' and pushes each pair into an array.
    for (let i = 0; i < selectedTeams.length; i += 2) {
        matchups.push([selectedTeams[i], selectedTeams[i + 1]]);
}

return (
    <div className ="bracket">
        <h1>New Bracket</h1>
        <button className="create-bracket">Create New Bracket</button>
        <h2>First Round: Select Teams</h2>
        <div className="first-round">
            {selectedTeams.map((team, idx) => (
                <select
                key={idx}
                value={team}
                onChange={e => handleTeamChange(idx, e.target.value)}
                className="team-dropdown"
                >
                <option value="">Select Team</option>
                {teamsList.map(t => (
                    <option key={t} value={t}>{t}</option>
        ***REMOVED***)}
                </select>

    ***REMOVED***)}
        </div>
        <h2>Matchups</h2>
            <div className="matchups">
                {matchups.map(([team1, team2], idx) => (
                    <div key={idx} className="matchup">
                        <span>{team1 || 'TBD'}</span> vs <span>{team2 || 'TBD'}</span>
                    </div>
        ***REMOVED***)}
            </div>
        <h1>Your Current Bracket</h1>
        
    </div>
)
};

export default Bracket;