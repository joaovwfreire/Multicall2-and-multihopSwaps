# Swap and multicall Environment
This repo contains a couple of tools that can be used to deploy a swap and multicall environment on EVM compatible chains. It currently supports Uniswap V2 and it's forks.

## Testing environment
The testing environment is based on [Hardhat](https://hardhat.org/). To run the tests, you need to install the dependencies with `yarn install` and then run `yarn hardhat test`.
Scripts can be found in the `scripts` folder, and run with node.

### Testing logic 
In order to test the smart contracts, I've forked the mainnet and impersonated an account to have a balance of the token I wanted to test (in this case, WETH). I've then deployed the Swap contracts at the test environment and tried a couple of swaps (single hop and multi hop) for exact amounts in and for exact amounts out.

### Scripts
The scripts folder contains a couple of Multicall queries on a contract deployed to mainnet. Each contains a different set of calls that exemplify the use of the Multicall contract to DeFi applications.

## Upcoming
- [ ] Add multihop swaps to different dexes (Sushiswap)
- [ ] Add support for Uniswap V3
- [ ] Add support for Balancer
- [ ] Add support for Curve
- [ ] Add support for 0x

## Disclaimer
This repo is not intended to be used in production. It's just a compilation of tools that can be used to build a swap and multicall environment. The code is not audited and it's not intended to be used in production. Use at your own risk.