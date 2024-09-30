import hre from "hardhat";


async function main() {
    const usdc = await hre.ethers.getContractAt("Token", "0x6D34420DcAf516bEc9D81e5d79FAC2100058C9AC");
    const amount = 100000000n * (10n ** 18n)
    const tx = await usdc.mint("0x8053460f2EbE8f5aAdB39D80d84ED1501442b272", amount)
    tx.wait()
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
