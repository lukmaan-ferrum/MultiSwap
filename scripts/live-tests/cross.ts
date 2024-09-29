import hre from "hardhat";
import addresses from "../../constants/addresses_test.json";

async function main() {
    const targetNetwork = "ferrum_testnet";
    const thisNetwork = hre.network.name;
    const targetNetworkInfo = addresses.networks[targetNetwork];
    const targetChainID = targetNetworkInfo.chainId;
    const currentNetworkInfo = addresses.networks[thisNetwork];

    const fiberRouterAddress = "0x4e432986B1C34AEdDbFaD434947623856E5c0D5d";
    const fiberRouter = await hre.ethers.getContractAt("FiberRouter", fiberRouterAddress);
    const recipient = "0x93069da82B264E94068aA991b88b3478cf0861BE"
    const foundryAddress = addresses.networks[thisNetwork].foundry;
    const qpFeeTokenAddress = "0x6d34420dcaf516bec9d81e5d79fac2100058c9ac"
    const amountIn = 500000n
    const qpFeeAmount = 10n ** 18n;

    const mockFoundry = await hre.ethers.getContractAt("Token", foundryAddress);
    const qpFeeToken = await hre.ethers.getContractAt("Token", qpFeeTokenAddress);

    const approveFoundryTx = await mockFoundry.approve(fiberRouterAddress, amountIn)
    approveFoundryTx.wait()
    console.log("Approved Foundry")

    const approveQpFeeTokenTx = await qpFeeToken.approve(fiberRouterAddress, qpFeeAmount)
    approveQpFeeTokenTx.wait()
    console.log("Approved QP Fee Token")

    const tx = await fiberRouter.cross(
        "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
        amountIn,
        qpFeeAmount,
        recipient,
        56,
        0,
        "0x",
        {
            gasLimit: 4000000
        }
    )

    console.log("hash: ", tx.hash)
    await tx.wait()
    console.log("confirmed")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
