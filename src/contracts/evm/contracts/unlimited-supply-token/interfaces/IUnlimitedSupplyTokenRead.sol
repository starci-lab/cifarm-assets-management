// SPDX-License-Identifier: 3.0
pragma solidity ^0.8.24;

interface IUnlimitedSupplyTokenRead {
    function MINTER() external returns (bytes32);
    function BURNER() external returns (bytes32);
}