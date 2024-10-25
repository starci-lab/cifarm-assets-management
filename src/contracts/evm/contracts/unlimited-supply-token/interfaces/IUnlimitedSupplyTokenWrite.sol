// SPDX-License-Identifier: 3.0
pragma solidity ^0.8.24;

interface IUnlimitedSupplyTokenWrite {
    function mint(address account, uint256 amount) external;

    function burn(address account, uint256 amount) external;
}
