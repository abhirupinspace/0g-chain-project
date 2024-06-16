// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "hardhat/console.sol";

contract PaymentContract {
    address private constant AOGI_ADDRESS = 0xC8df9cB27dD2736424333176323C1Bcef22E521A; // Replace with actual AOGI token address
    uint256 private constant FEE_AMOUNT = 1000000000000000; // 0.001 AOGI in wei

    using SafeERC20 for IERC20;

    function payFee() external {
        IERC20 aogi = IERC20(AOGI_ADDRESS);
        require(aogi.balanceOf(msg.sender) >= FEE_AMOUNT, "Insufficient AOGI balance");

        aogi.safeTransferFrom(msg.sender, address(this), FEE_AMOUNT);

        console.log("Payment of 0.001 AOGI successful");
    }
}
