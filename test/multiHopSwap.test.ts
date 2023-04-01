
const {assert , expect} = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

require("dotenv").config();

const WETH_HOLDER = "0x57757E3D981446D585Af0D9Ae4d7DF6D64647806"
const DAI_HOLDER = "0x60FaAe176336dAb62e284Fe19B885B095d29fB7F"
const AAVE_HOLDER = "0x3744DA57184575064838BBc87A0FC791F5E39eA2"
const USDC_HOLDER = "0x756D64Dc5eDb56740fC617628dC832DDBCfd373c"
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
const AAVE = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

async function forkReset() {
    await hre.network.provider.request({
        method: "hardhat_reset",
        params: [
          {
            forking: {
              jsonRpcUrl: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
              blockNumber: 16524970,
            },
          },
        ],
      });
}


describe("MultiHopSwap", function () {
    let swapContract;
    let accounts;

    let WETHHolderBalance;
    let WETHContract;
    let impersonateSigner;

    beforeEach(async function () {

        accounts = await ethers.getSigners();

        const SwapContract = await ethers.getContractFactory("MultiHopSwap");
        swapContract = await SwapContract.deploy();
        await swapContract.deployed();

    });

    describe("Exact Amount in", function () {

        beforeEach(async function () {

            await hre.network.provider.request({
                method: "hardhat_impersonateAccount",
                params: [WETH_HOLDER],
            });
    
            WETHContract = await ethers.getContractAt("IERC20", WETH);
            impersonateSigner = await ethers.getSigner(WETH_HOLDER);
            
            WETHHolderBalance = await WETHContract.balanceOf(
                impersonateSigner.address
            );
    
            await impersonateSigner.sendTransaction({
                to: accounts[0].address,
                value: ethers.utils.parseEther("30"),
            });
    
            await WETHContract.connect(impersonateSigner).transfer(
                accounts[0].address,
                WETHHolderBalance
            )
        });
        
        it("Should swap WETH for DAI", async function () {

            const DAIContract = await ethers.getContractAt("IERC20", DAI);

            const DAIBalance = await DAIContract.balanceOf(accounts[0].address)

            await WETHContract.connect(accounts[0]).approve(swapContract.address, WETHHolderBalance)
            const tx = await swapContract.connect(accounts[0]).MultiHopExactAmountIn(WETH, WETHHolderBalance, 100000, [WETH, DAI])
            
            const amounts = await tx.wait();
           
            
            const newWethBalance = await WETHContract.balanceOf(accounts[0].address)
            expect (newWethBalance).to.equal(0)

            
            const newDAIBalance = await DAIContract.balanceOf(accounts[0].address)
            expect (newDAIBalance).to.be.gt(DAIBalance)

            forkReset()

        });

        it("Should swap WETH for AAVE", async function () {
            
            const AAVEContract = await ethers.getContractAt("IERC20", AAVE);

            const AAVEBalance = await AAVEContract.balanceOf(accounts[0].address)

            await WETHContract.connect(accounts[0]).approve(swapContract.address, WETHHolderBalance)
            const tx = await swapContract.connect(accounts[0]).MultiHopExactAmountIn(WETH, WETHHolderBalance, 100000, [WETH, AAVE])

            const amounts = await tx.wait();

            const newWethBalance = await WETHContract.balanceOf(accounts[0].address)
            expect (newWethBalance).to.equal(0)

            const newAAVEBalance = await AAVEContract.balanceOf(accounts[0].address)
            expect (newAAVEBalance).to.be.gt(AAVEBalance)


            forkReset()
        });
        
        it("Should swap WETH for AAVE for DAI", async function () {
            
            const DAIContract = await ethers.getContractAt("IERC20", DAI);
            const AAVEContract = await ethers.getContractAt("IERC20", AAVE);


            const DAIBalance = await DAIContract.balanceOf(accounts[0].address)
            const AAVEBalance = await AAVEContract.balanceOf(accounts[0].address)

            await WETHContract.connect(accounts[0]).approve(swapContract.address, WETHHolderBalance)
            const tx = await swapContract.connect(accounts[0]).MultiHopExactAmountIn(WETH, WETHHolderBalance, 100000, [WETH, AAVE, DAI])

            const amounts = await tx.wait();

            const newWethBalance = await WETHContract.balanceOf(accounts[0].address)
            expect (newWethBalance).to.equal(0)

            const newAAVEBalance = await AAVEContract.balanceOf(accounts[0].address)
            expect (newAAVEBalance).to.equal(0)

            const newDAIBalance = await DAIContract.balanceOf(accounts[0].address)
            expect (newDAIBalance).to.be.gt(DAIBalance)

            forkReset()
        });

        it("Should swap WETH for AAVE for DAI for USDC", async function () {
            
            const AAVEContract = await ethers.getContractAt("IERC20", AAVE);
            const DAIContract = await ethers.getContractAt("IERC20", DAI);
            const USDCContract = await ethers.getContractAt("IERC20", USDC);

            const AAVEBalance = await AAVEContract.balanceOf(accounts[0].address)
            const DAIBalance = await DAIContract.balanceOf(accounts[0].address)
            const USDCBalance = await USDCContract.balanceOf(accounts[0].address)

            await WETHContract.connect(accounts[0]).approve(swapContract.address, WETHHolderBalance)
            const tx = await swapContract.connect(accounts[0]).MultiHopExactAmountIn(WETH, WETHHolderBalance, 100000, [WETH, AAVE, DAI, USDC])

            const amounts = await tx.wait();

            const newWethBalance = await WETHContract.balanceOf(accounts[0].address)
            expect (newWethBalance).to.equal(0)

            const newAAVEBalance = await AAVEContract.balanceOf(accounts[0].address)
            expect (newAAVEBalance).to.equal(AAVEBalance)

            const newDAIBalance = await DAIContract.balanceOf(accounts[0].address)
            expect (newDAIBalance).to.equal(DAIBalance)

            const newUSDCBalance = await USDCContract.balanceOf(accounts[0].address)
            expect (newUSDCBalance).to.be.gt(USDCBalance)

            
            forkReset()
        });

    });

    describe("Exact Amount out", function () {

        beforeEach(async function () {

            await hre.network.provider.request({
                method: "hardhat_impersonateAccount",
                params: [WETH_HOLDER],
            });
    
            WETHContract = await ethers.getContractAt("IERC20", WETH);
            impersonateSigner = await ethers.getSigner(WETH_HOLDER);
            
            WETHHolderBalance = await WETHContract.balanceOf(
                impersonateSigner.address
            );
    
            await impersonateSigner.sendTransaction({
                to: accounts[0].address,
                value: ethers.utils.parseEther("30"),
            });
    
            await WETHContract.connect(impersonateSigner).transfer(
                accounts[0].address,
                WETHHolderBalance
            )
        });

        it("Should swap WETH for DAI", async function () {
            
            const DAIContract = await ethers.getContractAt("IERC20", DAI);
            const DAIBalance = await DAIContract.balanceOf(accounts[0].address)

            await WETHContract.connect(accounts[0]).approve(swapContract.address, WETHHolderBalance)
            const tx = await swapContract.connect(accounts[0]).MultiHopExactAmountOut(WETH, 1000000, WETHHolderBalance, [WETH, DAI])

            const amounts = await tx.wait();

            const newWethBalance = await WETHContract.balanceOf(accounts[0].address)
            expect (newWethBalance).to.lt(WETHHolderBalance)
            expect (newWethBalance).to.gt(0)

            const newDAIBalance = await DAIContract.balanceOf(accounts[0].address)
            expect (newDAIBalance).to.be.gt(DAIBalance)

            forkReset()
        });

        it("Should swap WETH for AAVE", async function () {

            const AAVEContract = await ethers.getContractAt("IERC20", AAVE);
            const AAVEBalance = await AAVEContract.balanceOf(accounts[0].address)

            await WETHContract.connect(accounts[0]).approve(swapContract.address, WETHHolderBalance)
            const tx = await swapContract.connect(accounts[0]).MultiHopExactAmountOut(WETH, 1000000, WETHHolderBalance, [WETH, AAVE])

            const amounts = await tx.wait();

            const newWethBalance = await WETHContract.balanceOf(accounts[0].address)
            expect (newWethBalance).to.lt(WETHHolderBalance)
            expect (newWethBalance).to.gt(0)

            const newAAVEBalance = await AAVEContract.balanceOf(accounts[0].address)
            expect (newAAVEBalance).to.be.gt(AAVEBalance)
            
            forkReset()
        });
        
        it("Should swap WETH for AAVE for DAI", async function () {

            const DAIContract = await ethers.getContractAt("IERC20", DAI);
            const AAVEContract = await ethers.getContractAt("IERC20", AAVE);

            const DAIBalance = await DAIContract.balanceOf(accounts[0].address)
            const AAVEBalance = await AAVEContract.balanceOf(accounts[0].address)

            await WETHContract.connect(accounts[0]).approve(swapContract.address, WETHHolderBalance)
            const tx = await swapContract.connect(accounts[0]).MultiHopExactAmountOut(WETH, 1000000, WETHHolderBalance, [WETH, AAVE, DAI])

            const amounts = await tx.wait();

            const newWethBalance = await WETHContract.balanceOf(accounts[0].address)
            expect (newWethBalance).to.lt(WETHHolderBalance)
            expect (newWethBalance).to.gt(0)

            const newAAVEBalance = await AAVEContract.balanceOf(accounts[0].address)
            expect (newAAVEBalance).to.be.eq(AAVEBalance)

            const newDAIBalance = await DAIContract.balanceOf(accounts[0].address)
            expect (newDAIBalance).to.be.gt(DAIBalance)
                
            forkReset()
        });

        it("Should swap WETH for AAVE for DAI for USDC", async function () {

            const DAIContract = await ethers.getContractAt("IERC20", DAI);
            const AAVEContract = await ethers.getContractAt("IERC20", AAVE);
            const USDCContract = await ethers.getContractAt("IERC20", USDC);

            const DAIBalance = await DAIContract.balanceOf(accounts[0].address)
            const AAVEBalance = await AAVEContract.balanceOf(accounts[0].address)
            const USDCBalance = await USDCContract.balanceOf(accounts[0].address)

            await WETHContract.connect(accounts[0]).approve(swapContract.address, WETHHolderBalance)
            const tx = await swapContract.connect(accounts[0]).MultiHopExactAmountOut(WETH, 1000000, WETHHolderBalance, [WETH, AAVE, DAI, USDC])

            const amounts = await tx.wait();

            const newWethBalance = await WETHContract.balanceOf(accounts[0].address)
            expect (newWethBalance).to.lt(WETHHolderBalance)
            expect (newWethBalance).to.gt(0)

            const newAAVEBalance = await AAVEContract.balanceOf(accounts[0].address)
            expect (newAAVEBalance).to.be.eq(AAVEBalance)

            const newDAIBalance = await DAIContract.balanceOf(accounts[0].address)
            expect (newDAIBalance).to.be.eq(DAIBalance)

            const newUSDCBalance = await USDCContract.balanceOf(accounts[0].address)
            expect (newUSDCBalance).to.be.gt(USDCBalance)
                  
            forkReset()
        });
    });
});