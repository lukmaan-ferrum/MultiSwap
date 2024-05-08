import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { serialize, UnsignedTransaction } from "@ethersproject/transactions";
import { ContractTransaction, keccak256, randomBytes } from "ethers";
import hre from "hardhat";
import RLP from "rlp"

const gasPriceOracleAbi = [{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"l1BaseFee","type":"uint256"}],"name":"L1BaseFeeUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"overhead","type":"uint256"}],"name":"OverheadUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_oldOwner","type":"address"},{"indexed":true,"internalType":"address","name":"_newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"scalar","type":"uint256"}],"name":"ScalarUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_oldWhitelist","type":"address"},{"indexed":false,"internalType":"address","name":"_newWhitelist","type":"address"}],"name":"UpdateWhitelist","type":"event"},{"inputs":[{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"getL1Fee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"getL1GasUsed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l1BaseFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"overhead","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"scalar","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_l1BaseFee","type":"uint256"}],"name":"setL1BaseFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_overhead","type":"uint256"}],"name":"setOverhead","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_scalar","type":"uint256"}],"name":"setScalar","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newWhitelist","type":"address"}],"name":"updateWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"whitelist","outputs":[{"internalType":"contract IWhitelist","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
const provider = hre.network.provider;
const privateKey = process.env.PRIVATE_GAS_ESTIMATION!;
const wallet = new ethers.Wallet(privateKey);


export async function estimateL1Fee(gasOraclePrecompileAddress: string, unsignedSerializedTransaction: string): Promise<bigint> {
    const l1GasOracle = await ethers.getContractAt(gasPriceOracleAbi, gasOraclePrecompileAddress);
    return l1GasOracle.getL1Fee(unsignedSerializedTransaction);
}
  
export async function estimateL2Fee(tx: ContractTransaction): Promise<bigint> {
    const gasToUse = await ethers.provider.estimateGas(tx);
    const feeData = await ethers.provider.getFeeData();
    const gasPrice = feeData.gasPrice;
  
    if (!gasPrice) {
        throw new Error("There was an error estimating L2 fee");
    }
  
    return gasToUse * gasPrice;
}

export async function buildSamplePopulatedTransaction(address: string): Promise<ContractTransaction> {
    const fiberRouter = await ethers.getContractAt("FiberRouter", address);

    return fiberRouter.withdrawSigned.populateTransaction(
        keccak256(randomBytes(32)).slice(0,42), // random address
        keccak256(randomBytes(32)).slice(0,42), // random address
        1111111122222222, // some number
        keccak256(randomBytes(32)), // random bytes
        1714880880, // some unix timestamp
        keccak256(randomBytes(32)) + keccak256(randomBytes(32)).slice(2), // random bytes for signature
        true
    );
}

export async function buildUnsignedTransaction(signer: HardhatEthersSigner, populatedTransaction: ContractTransaction): Promise<UnsignedTransaction> {
    const nonce = await signer.getNonce();

    return {
        data: populatedTransaction.data,
        to: populatedTransaction.to,
        gasPrice: 1000000000,
        gasLimit: 500000,
        value: 0,
        nonce,
    };
}

export function getSerializedTransaction(tx: UnsignedTransaction) {
    return serialize(tx);
}

async function getEstimatedFees(gasOracleAddress: string, populatedTransaction: ContractTransaction, serializedTransaction: string) {
    // const estimatedL1Fee = await estimateL1Fee(gasOracleAddress, serializedTransaction);
    const estimatedL2Fee = await estimateL2Fee(populatedTransaction);
    const estimatedTotalFee = estimatedL2Fee;

    return {
        // estimatedL1Fee,
        estimatedL2Fee,
        estimatedTotalFee
    }
}

async function main() {
    const { getSigners } = ethers;
    const [ signer ] = await getSigners();

    const ORACLE_PRECOMPILE_ADDRESS = "0x5300000000000000000000000000000000000002"
    const FIBER_ROUTER_ADDRESS = "0x35dA469ECbFFCBfaF8cAC31Fe0645B158e252Eb6"

    
    const populatedTransaction = await buildSamplePopulatedTransaction(FIBER_ROUTER_ADDRESS);
    const unsignedTransaction = await buildUnsignedTransaction(signer, populatedTransaction);
    const serializedTransaction = getSerializedTransaction(unsignedTransaction);
    const estimatedFees = await getEstimatedFees(ORACLE_PRECOMPILE_ADDRESS, populatedTransaction, serializedTransaction);

    console.log(estimatedFees)


    // Building the transaction and getting the estimated fees

    // console.log("Estimated L1 fee (wei):", estimatedFees.estimatedL1Fee.toString());
    // console.log("Estimated L2 fee (wei):", estimatedFees.estimatedL2Fee.toString());
    // console.log("Estimated total fee (wei): ", estimatedFees.estimatedTotalFee.toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});