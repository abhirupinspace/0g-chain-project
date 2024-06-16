import React, { useState, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { ContractFactory } from '@ethersproject/contracts';
import { signInWithGoogle, signOut, getCurrentUser } from './firebase/auth'; // Correct import path
import { db } from './firebase/firebaseConfig'; // Ensure db is correctly initialized
import axios from 'axios'; // Import Axios for HTTP requests
import Dashboard from './Dashboard';
import XPDetailsPopup from './XPDetailsPopup'; // Import the XP popup component
import './App.css';

function WalletPopup({ account, onClose, onDisconnect }) {
    return (
        <div className="wallet-popup-container">
            <h3>Wallet Details</h3>
            <p><strong>Account:</strong> {account}</p>
            <button onClick={onDisconnect}>Disconnect Wallet</button>
            <button onClick={onClose}>Close</button>
        </div>
    );
}

function CustomContractOverlay({ onClose, onCustomContractSubmit }) {
    const [contractName, setContractName] = useState('');
    const [contractType, setContractType] = useState('');
    const [otherRequirements, setOtherRequirements] = useState('');

    const handleSubmit = () => {
        // Form validation or submission logic
        const customContract = {
            name: contractName,
            type: contractType,
            requirements: otherRequirements
        };
        onCustomContractSubmit(customContract);
        onClose();
    };

    return (
        <div className="wallet-popup-container">
            <h3>Create Custom Contract</h3>
            <input
                type="text"
                placeholder="Contract Name"
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Contract Type"
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
            />
            <textarea
                placeholder="Other Requirements"
                value={otherRequirements}
                onChange={(e) => setOtherRequirements(e.target.value)}
            ></textarea>
            <div>
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

function App() {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [user, setUser] = useState(null);
    const [showWalletPopup, setShowWalletPopup] = useState(false); // State for showing wallet popup
    const [showCustomContractOverlay, setShowCustomContractOverlay] = useState(false); // State for showing custom contract overlay
    const [loading, setLoading] = useState(false); // State for loading animation
    const [xp, setXp] = useState(0); // State for XP
    const [showXpPopup, setShowXpPopup] = useState(false); // State for showing XP popup

    useEffect(() => {
        getCurrentUser().then(user => {
            setUser(user);
        });
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new Web3Provider(window.ethereum);
                const accounts = await provider.listAccounts();
                setAccount(accounts[0]);
            } catch (error) {
                console.error("Failed to connect to wallet:", error);
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setShowWalletPopup(false); // Close the wallet popup after disconnecting
    };

    const handleSignIn = async () => {
        try {
            await signInWithGoogle();
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            setUser(null);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const fetchGeneratedContract = async (templateName) => {
        setLoading(true); // Start loading animation
        try {
            const response = await axios.post('http://localhost:3001/generateContract', {
                templateName
            });
    
            if (!response.data.contract) {
                throw new Error('Failed to fetch contract');
            }
    
            console.log('Received contract:', response.data.contract);
            setContract(response.data.contract);
            setSelectedTemplate(templateName);
            setXp(xp + 100); // Award 100 XP
        } catch (error) {
            console.error('Error fetching contract:', error.message);
            alert('Failed to fetch contract. Please try again later.');
        } finally {
            setLoading(false); // Stop loading animation
        }
    };

    const deployContract = async () => {
        if (!contract) {
            alert('Please generate a contract first');
            return;
        }
    
        const provider = new Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const factory = new ContractFactory(contract.abi, contract.bytecode, signer);
    
        try {
            // Deploy the contract
            const deployedContract = await factory.deploy();
            console.log('Contract deployed to:', deployedContract.address);
    
            // Store deployed contract information in Firestore
            await db.collection('contracts').add({
                template: selectedTemplate,
                address: deployedContract.address,
                deployedBy: account,
                createdAt: new Date()
            });
    
            alert('Contract deployed successfully!');
        } catch (error) {
            console.error('Error deploying contract:', error);
            alert('Failed to deploy contract. Please check console for details.');
        }
    };

    const handleCustomContractSubmit = async (customContract) => {
        // Handle custom contract submission logic (e.g., send to backend, process, etc.)
        console.log('Submitted Custom Contract:', customContract);
        // Example: Send to backend for processing
        try {
            const response = await axios.post('http://localhost:3001/createCustomContract', customContract);
            console.log('Custom contract creation response:', response.data);
            alert('Custom contract created successfully!');
        } catch (error) {
            console.error('Error creating custom contract:', error.message);
            alert('Failed to create custom contract. Please try again later.');
        }
    };

    const appClasses = darkMode ? 'App dark-mode' : 'App light-mode';

    return (
        <div className={appClasses}>
            <header>
                <h1 style={{ fontFamily: 'Fascinate Inline' }}>./KOFTA</h1>
                <div className='headbuttons'>
                    <button onClick={Dashboard}>./Dashboard</button>
                    <button onClick={toggleDarkMode}>{darkMode ? './Light Mode' : './Dark Mode'}</button>
                    {user ? (
                        <button onClick={handleSignOut}>./Logout</button>
                    ) : (
                        <button onClick={handleSignIn}>./Login</button>
                    )}
                    {account ? (
                        <button onClick={() => setShowWalletPopup(true)}>./Wallet Connected</button>
                    ) : (
                        <button onClick={connectWallet}>./Connect Wallet</button>
                    )}
                </div>
            </header>
            <main>
                <section id="templates">
                    <div className='pagename'>
                        <h2>Select a Template</h2>
                        <h1>./HOME</h1>
                    </div>
                    <div className="template-container">
                        <div className="template" onClick={() => fetchGeneratedContract("ERC20 Token")}>ERC20 Token</div>
                        <div className="template" onClick={() => fetchGeneratedContract("NFT Minting")}>NFT Minting</div>
                        <div className="template" onClick={() => fetchGeneratedContract("Voting System")}>Voting System</div>
                        <div className="template" onClick={() => fetchGeneratedContract("Decentralized Exchange")}>Decentralized Exchange</div>
                        <div className="template" onClick={() => fetchGeneratedContract("DAO Governance")}>DAO Governance</div>
                        <div className="template" onClick={() => fetchGeneratedContract("Subscription Service")}>Subscription Service</div>
                        <div className="template" onClick={() => fetchGeneratedContract("Supply Chain Management")}>Supply Chain Management</div>
                        <div className="template" onClick={() => fetchGeneratedContract("Crowdfunding Platform")}>Crowdfunding Platform</div>
                        <div className="template" onClick={() => fetchGeneratedContract("Multi-Sig Wallet")}>Multi-Sig Wallet</div>
                        <div className="template" onClick={() => fetchGeneratedContract("Escrow Service")}>Escrow Service</div>
                        <div className="template" onClick={() => fetchGeneratedContract ("Decentralized Storage")}>Decentralized Storage</div>
                        <div className="template" onClick={() => fetchGeneratedContract("Lending Protocol")}>Lending Protocol</div>
                    </div>
                </section>
                <section id="generatedContract">
                    <h2>Generated Smart Contract</h2>
                    {loading ? (
                        <div className="loading-spinner">
                            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                        </div>
                    ) : (
                        <textarea id="contractOutput" readOnly value={contract}></textarea>
                    )}
                    <div className='btndploy'>
                        <button onClick={deployContract}>Deploy Contract</button>
                        <button onClick={() => setShowCustomContractOverlay(true)}>Create Custom Contract</button>
                    </div>
                </section>
                <div className="xp-container">
                    <button className="xp-button" onClick={() => setShowXpPopup(true)}>XP: {xp}</button>
                </div>
            </main>

            {/* Wallet Popup */}
            {showWalletPopup && (
                <div className="wallet-popup-overlay">
                    <div className="wallet-popup-container">
                        <WalletPopup
                            account={account}
                            onClose={() => setShowWalletPopup(false)}
                            onDisconnect={disconnectWallet}
                        />
                    </div>
                </div>
            )}

            {/* XP Details Popup */}
            {showXpPopup && (
                <div className="wallet-popup-overlay">
                    <div className="wallet-popup-container">
                        <XPDetailsPopup
                            xp={xp}
                            onClose={() => setShowXpPopup(false)}
                        />
                    </div>
                </div>
            )}

            {/* Custom Contract Overlay */}
            {showCustomContractOverlay && (
                <div className="wallet-popup-overlay">
                    <div className="wallet-popup-container">
                        <CustomContractOverlay
                            onClose={() => setShowCustomContractOverlay(false)}
                            onCustomContractSubmit={handleCustomContractSubmit}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;

