//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    address immutable owner;

    constructor() ERC20("MockUSD", "sUSD") {
        owner = msg.sender;
        _mint(owner, 10000000 * 10 ** 6);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "ONLY OWNER!!!");
        _;
    }

    function mint(address to, uint256 amt) external onlyOwner()  {
        _mint(to, amt * 10 ** 6);
    }

    function burn(address from, uint256 amt) external onlyOwner() {
        _burn(from, amt * 10 ** 6);
    }
}
