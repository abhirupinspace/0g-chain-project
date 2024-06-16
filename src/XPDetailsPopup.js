import React from 'react';
import './XPDetailsPopup.css'; // Create a new CSS file for styling this component

function XPDetailsPopup({ xp, onClose }) {
    return (
        <div className="xp-popup-overlay">
            <div className="xp-popup-container">
                <h3>Rewards</h3>
                <p><strong>Current XP:</strong> {xp}</p>
                <p>Point redeem feature coming soon!</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default XPDetailsPopup;