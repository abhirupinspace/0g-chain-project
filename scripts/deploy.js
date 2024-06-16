const { ethers } = require("ethers");

async function main() {
    // Set up the provider and signer
    const provider = new ethers.providers.JsonRpcProvider("https://rpc.testnet.0g.network");
    const privateKey = "YOUR_PRIVATE_KEY"; // Replace with your private key
    const wallet = new ethers.Wallet(privateKey, provider);

    // Deploying contracts
    const PaymentContract = await ethers.getContractFactory("PaymentContract");
    const contract = await PaymentContract.connect(wallet).deploy();

    console.log("Deploying PaymentContract to ZG testnet...");

    await contract.deployed();

    console.log("PaymentContract deployed to:", contract.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
