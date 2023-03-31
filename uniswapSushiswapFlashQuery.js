const { ethers } = require('ethers')
const multicallAbi = require('./abi/multicall2.json')
const uniswapv2pairAbi = require('./abi/uniswapv2pair.json')
const uniswapv2router02Abi = require('./abi/uniswapv2router02.json')
const provider = new ethers.providers.InfuraProvider()

Number.prototype.noExponents = function() {
    var data = String(this).split(/[eE]/);
    if (data.length == 1) return data[0];
  
    var z = '',
      sign = this < 0 ? '-' : '',
      str = data[0].replace('.', ''),
      mag = Number(data[1]) + 1;
  
    if (mag < 0) {
      z = sign + '0.';
      while (mag++) z += '0';
      return z + str.replace(/^\-/, '');
    }
    mag -= str.length;
    while (mag--) z += '0';
    return str + z;
  }

const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
const AAVE = '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9'
const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

const UNI = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'

const array = [1]

const main = async () => {
    const multicall2 = new ethers.Contract('0x9695FA23b27022c7DD752B7d64bB5900677ECC21', multicallAbi, provider)
    
    const uniSwapRouterV2 = new ethers.Contract('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', require('./abi/uniswapv2router02.json'), provider)
    const sushiSwapRouter = new ethers.Contract('0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F', require('./abi/uniswapv2router02.json'), provider)

    const batchCalldata = array.map((pair, i) => {
       
        return{
            target: uniSwapRouterV2.address,
            callData: uniSwapRouterV2.interface.encodeFunctionData('getAmountsOut', [ethers.utils.parseUnits('0.01', 18),[WETH, AAVE, DAI]])
        }
    })

    const outputA = await multicall2.callStatic.tryAggregate(false, batchCalldata)
    
    
    
    const batchCalldata2 = array.map((pair, i) => {
       
        return{
            target: sushiSwapRouter.address,
            callData: sushiSwapRouter.interface.encodeFunctionData('getAmountsOut', [parseInt(outputA[0].returnData.slice(-64), 16).noExponents(), [DAI, WETH]])
        }
    })

    const outputB = await multicall2.callStatic.tryAggregate(false, batchCalldata2)

    console.log(`0.01 WETH -> AAVE -> DAI at Uniswap \nDAI -> WETH at Sushiswap \nFinal yield: ${parseInt(outputB[0].returnData.slice(-64), 16).noExponents()} wei WETH`)

    console.log("\n@ " + new Date().toLocaleString())
}

setInterval(main, 5000)