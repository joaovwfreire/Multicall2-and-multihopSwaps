const { ethers } = require('ethers')
const multicallAbi = require('./abi/multicall2.json')
const uniswapv2pairAbi = require('./abi/uniswapv2pair.json')
const provider = new ethers.providers.InfuraProvider()



const uniSwapPairs = [
    ["0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc", "USDC-WETH"],
    ["0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11", "DAI-WETH"],
    ["0xB6909B960DbbE7392D405429eB2b3649752b4838", "WETH-BAT"],
    ["0xBb2b8038a1640196FbE3e38816F3e67Cba72D940", "WBTC-WETH"],
    ["0x43AE24960e5534731Fc831386c07755A2dc33D47", "WETH-SNX"],
    ["0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5", "DAI-USDC"],
    ["0xB784CED6994c928170B417BBd052A096c6fB17E2", "WETH-NMR"],
    ["0xa2107FA5B38d9bbd2C461D6EDf11B11A50F6b974", "WETH-LINK"],
    ["0x718Dd8B743ea19d71BDb4Cb48BB984b73a65cE06", "DONUT-WETH"],
    ["0x55D5c232D921B9eAA6b37b5845E439aCD04b4DBa", "WETH-HEX"],
    ["0xa5E79baEe540f000ef6F23D067cd3AC22c7d9Fe6", "WETH-CEL"],
    ["0xC2aDdA861F89bBB333c90c492cB837741916A225", "WETH-MKR"],
    ["0xc5be99A02C6857f9Eac67BbCE58DF5572498F40c", "WETH-AMPL"],
    ["0xa32523371390b0Cc4e11F6Bb236ecf4C2cDEA101", "WETH-RING"],
    ["0x6AeEbC2f5c979FD5C4361C2d288E55Ac6b7e39Bb", "WETH-PAR"],
    ["0xE0cc5aFc0FF2c76183416Fb8d1a29f6799FB2cdF", "WETH-XIO"]
]

const main = async () => {
    const multicall2 = new ethers.Contract('0x9695FA23b27022c7DD752B7d64bB5900677ECC21', multicallAbi, provider)
    const uniSwapPairContracts = uniSwapPairs.map(pair => new ethers.Contract(pair[0], uniswapv2pairAbi, provider))

    const batchCalldata = uniSwapPairContracts.map(pair => {
        return{
            target: pair.address,
            callData: pair.interface.encodeFunctionData('getReserves')
        }
    })

    const outputE = await multicall2.callStatic.tryAggregate(false, batchCalldata)

    const output = outputE.map((o, i) => {
        if (o.success) {
            console.log('\n')
            console.log(uniSwapPairs[i][1])
            console.log("Reserve 0:", parseInt(o.returnData.slice(2, 66), 16))
            console.log("Reserve 1:", parseInt(o.returnData.slice(67, 130), 16))
            console.log("Last block timestamp:", parseInt(o.returnData.slice(131, 194), 16))
            
        }    
    })

    console.log("queries @ " + new Date().toLocaleString())
}

setInterval(main, 2500)