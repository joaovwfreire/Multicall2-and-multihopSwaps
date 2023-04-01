// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

contract MultiHopSwap {

    address private constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    IUniswapV2Router02 private UNISWAP_ROUTER; 
   
   constructor() {
        UNISWAP_ROUTER = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
    }
    function MultiHopExactAmountOut(address token, uint amountOut, uint amountInMax, address[] memory path) external returns (uint[] memory amounts){
        IERC20 tokenIn = IERC20(token);

        tokenIn.transferFrom(msg.sender, address(this), amountInMax);
        tokenIn.approve(UNISWAP_ROUTER_ADDRESS, amountInMax);

        amounts = UNISWAP_ROUTER.swapTokensForExactTokens(
            amountOut, 
            amountInMax, 
            path, 
            msg.sender, 
            block.timestamp
        );

        if (amounts[0] < amountInMax) {
            tokenIn.transfer(msg.sender, amountInMax - amounts[0]);
        }

    }

    function MultiHopExactAmountIn(address token, uint amountIn, uint amountOutMin, address[] memory path) external returns (uint[] memory amounts){
        IERC20 tokenIn = IERC20(token);

        tokenIn.transferFrom(msg.sender, address(this), amountIn);
        tokenIn.approve(UNISWAP_ROUTER_ADDRESS, amountIn);

        amounts = UNISWAP_ROUTER.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            msg.sender,
            block.timestamp
        );
    }
}