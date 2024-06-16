import React from 'react';

const WalletDetails = ({ account, balance }) => {
    return (
        <div className="wallet-details">
            <h3>Wallet Details</h3>
            <p><strong>Account:</strong> {account}</p>
            <p><strong>Balance:</strong> {balance} ETH</p>
        </div>
    );
};

export default WalletDetails;
