import { ContractTransactionResponse } from "ethers"
import addresses from "../constants/addresses.json"
import hre from "hardhat"
import cctpFundManagerArtifact from "../artifacts/contracts/multiswap-contracts/CCTPFundManager.sol/CCTPFundManager.json"


export const postDeployCctp = async function () {
    const cctpNetworks = Object.keys(addresses.networks).filter((network) =>
        addresses.networks[network].cctp !== undefined
    );

    const thisNetwork = hre.network.name

    // Initiate contract instance
    const signer = await hre.ethers.getSigners()
    const cctpFundManager = new hre.ethers.Contract(addresses.networks[thisNetwork].deployments.cctpFundManager, cctpFundManagerArtifact.abi, signer[0])


    let otherNetworks = Object.keys(addresses.networks).filter((network) =>
        network !== thisNetwork &&
        network !== "hardhat" &&
        network !== "localhost" &&
        cctpNetworks.includes(network)
    );

    for (const otherNetwork of otherNetworks) {
        await sendTx(cctpFundManager.setTargetCCTPNetwork(
            addresses.networks[otherNetwork].chainId,
            addresses.networks[otherNetwork].cctp.domain,
            addresses.networks[otherNetwork].deployments.cctpFundManager
        ), `Set target CCTP network for ${otherNetwork} successful`)
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

postDeployCctp()