pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

contract MultiHopSwap {

    address private constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    IUniswapV2Router private const UNISWAP_ROUTER = IUniswapV2Router(UNISWAP_ROUTER_ADDRESS);
    function MultiHopSwapExactAmountOut(address token, uint amountOut, uint amountInMax, uint[] memory path) external{
        IERC20 tokenIn = IERC20(token);

        tokenIn.transferFrom(msg.sender, address(this), amountInMax);
        tokenIn.approve(UNISWAP_ROUTER_ADDRESS, amountInMax);

        uint[] memory amounts = UNISWAP_ROUTER.swapTokensForExactTokens(
            amountOut, 
            amountInMax, 
            path, 
            msg.sender, 
            block.timestamp
        );

        if 


    }
}