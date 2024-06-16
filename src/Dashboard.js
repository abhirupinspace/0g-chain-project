// Dashboard.js
import React from 'react';

const Dashboard = ({ user }) => {
    return (
        <div className="dashboard">
            
            <h2>Welcome to Your Dashboard, {user.displayName}!</h2>
            {/* Add dashboard content here */}
        </div>
        
    );
};

export default Dashboard;
