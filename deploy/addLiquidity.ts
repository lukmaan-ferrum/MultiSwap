import { ContractTransactionResponse } from "ethers"
import addresses from "../constants/addresses.json"
import hre from "hardhat"
import fundManagerArtifact from "../artifacts/contracts/multiswap-contracts/FundManager.sol/FundManager.json"
import erc20abi from "./erc20Abi.json"


export const addLiquidity = async function (
) {
    const thisNetwork = hre.network.name

    const cctpNetworks = Object.keys(addresses.networks).filter((network) =>
        addresses.networks[network].cctp !== undefined
    );

    // Initiate contract instance
    const signer = await hre.ethers.getSigners()
    const usdc = new hre.ethers.Contract(addresses.networks[thisNetwork].foundry, erc20abi, signer[0])
    const fundManager = new hre.ethers.Contract(addresses.networks[thisNetwork].deployments.fundManager, fundManagerArtifact.abi, signer[0])
    const forgeFundManager = new hre.ethers.Contract(addresses.networks[thisNetwork].deployments.forgeFundManager, fundManagerArtifact.abi, signer[0])
    const cctpForgeFundManagerAddress = addresses.networks[thisNetwork].deployments.forgeCCTPFundManager

    const balance = await usdc.balanceOf(signer[0].address)
    console.log("USDC Balance: " + await usdc.balanceOf(signer[0].address))
    if (balance < hre.ethers.parseUnits("5", 6)) {
        console.log("Insufficient USDC balance. Please top up your account with USDC")
        process.exit(1)
    }

    // Add liquidity
    const fundManagerAmount = hre.ethers.parseUnits("3", 6)
    await sendTx(usdc.approve(fundManager, fundManagerAmount), "Approved USDC for FundManager")
    await sendTx(fundManager.addLiquidity(usdc, fundManagerAmount), "Added liquidity to FundManager")

    // // Add liquidity to forgeFundManager
    const forgeFundManagerAmount = hre.ethers.parseUnits("1", 6)
    await sendTx(usdc.approve(forgeFundManager, forgeFundManagerAmount), "Approved USDC for ForgeFundManager")
    await sendTx(forgeFundManager.addLiquidity(usdc, forgeFundManagerAmount), "Added liquidity to ForgeFundManager")

    if (cctpNetworks.includes(thisNetwork)) {
        // Add liquidity to forgeCctpFundManager
        await sendTx(usdc.transfer(cctpForgeFundManagerAddress, forgeFundManagerAmount), "Transferred USDC to ForgeCCTPFundManager")
    }
}

const sendTx = async (txResponse: Promise<ContractTransactionResponse>, successMessage?: string) => {
    const receipt = await (await txResponse).wait()
    await delay(100)
    if (receipt?.status == 1) {
        successMessage ? console.log(successMessage) : null
    } else {
        console.error("Transaction failed: " + receipt);
    }
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

addLiquidity()