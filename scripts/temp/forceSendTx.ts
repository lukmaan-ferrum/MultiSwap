import { ethers } from "ethers";

// RPC endpoint URL
const rpcUrl = "https://nd-829-997-700.p2pify.com/790712c620e64556719c7c9f19ef56e3" // Arbitrum
// const rpcUrl = "https://base-mainnet.core.chainstack.com/e7aa01c976c532ebf8e2480a27f18278"; // base

// Create a provider
const provider = new ethers.JsonRpcProvider(rpcUrl);
const privateKey = process.env.PRIVATE_GAS_ESTIMATION!;
const wallet = new ethers.Wallet(privateKey, provider);

// The raw transaction data
const rawTx = {
    to: "0x5Ac1a18F1101A1D55b9C97326AE2A25160Ca5e8a", // Address of the receiver or contract
    value: 0, // Amount to send (for ETH transfers)
    data: "0xa8cfc5c9000000000000000000000000af88d065e77c8cc2239327c5edb3a432268e5831000000000000000000000000eedfdd620629c7432970d22488124fc92ad6d426000000000000000000000000000000000000000000000000000000000007a1202c1f62c06c0b0e85832ffb6598dd7aa19eca7677d1a1f8aba7aa9b1b50d6268500000000000000000000000000000000000000000000000000000000663e825500000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000415cbe8b868c5742151b21c0fd3ef79263e80308d48a433f56c5cf7394f76508a41897c618f2cccf7af79e632f68669f8daf5d2ab41ee8768fbf31269f7ced81b11b00000000000000000000000000000000000000000000000000000000000000", // Encoded contract call or empty for plain ETH transfer
    gasLimit: 1000000, // Maximum gas to spend
    gasPrice: 200000000, // Gas price in wei
};

console.log("Using wallet address: " + wallet.address);

async function sendTransaction() {
    try {
        console.log("Sending transaction...");
        const txResponse = await wallet.sendTransaction(rawTx);
        console.log("Transaction sent! Hash:", txResponse.hash);

        // Wait for the transaction to be mined
        const receipt = await txResponse.wait();
        console.log("Transaction confirmed in block:", receipt!.blockNumber);
    } catch (error) {
        console.error("Error sending transaction:", error);
    }
}

sendTransaction();
