import { ContractTransactionResponse } from "ethers"
import addresses from "../constants/addresses.json"
import hre from "hardhat"
import cctpFundManagerArtifact from "../artifacts/contracts/multiswap-contracts/CCTPFundManager.sol/CCTPFundManager.json"
import forgeCctpFundManagerArtifact from "../artifacts/contracts/multiswap-contracts/ForgeCCTPFundManager.sol/ForgeCCTPFundManager.json"


export const postDeployCctp = async function (
) {
    // setTargetCCTPNetwork(uint256 _chainID, uint32 _targetNetworkDomain, address _targetCCTPFundManager)
    const cctpNetworks = Object.keys(addresses.networks).filter((network) =>
        addresses.networks[network].cctp !== undefined
    );

    const thisNetwork = hre.network.name

    // Initiate contract instance
    const signer = await hre.ethers.getSigners()

    const cctpFundManager = new hre.ethers.Contract(
        addresses.networks[thisNetwork].deployments.cctpFundManager,
        cctpFundManagerArtifact.abi,
        signer[0]
    )
    const forgeCctpFundManager = new hre.ethers.Contract(
        addresses.networks[thisNetwork].deployments.forgeCCTPFundManager,
        forgeCctpFundManagerArtifact.abi,
        signer[0]
    )

    let otherNetworks = cctpNetworks.filter(
        network => network !== 'localhost' && network !== 'hardhat' && network !== thisNetwork
    );

    console.log("Other networks: " + otherNetworks)

    for (const otherNetwork of otherNetworks) {
        console.log(`Setting target CCTP network for ${otherNetwork}`)
        await sendTx(cctpFundManager.setTargetCCTPNetwork(
            addresses.networks[otherNetwork].chainId,
            addresses.networks[otherNetwork].cctp.domain,
            addresses.networks[otherNetwork].deployments.cctpFundManager
        ), `Set target CCTP network for ${otherNetwork} successful`)

        await sendTx(forgeCctpFundManager.setTargetCCTPNetwork(
            addresses.networks[otherNetwork].chainId,
            addresses.networks[otherNetwork].cctp.domain,
            addresses.networks[otherNetwork].deployments.forgeCCTPFundManager
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