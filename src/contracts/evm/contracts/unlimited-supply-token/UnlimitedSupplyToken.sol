// SPDX-License-Identifier: 3.0
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IUnlimitedSupplyToken} from "./interfaces/IUnlimitedSupplyToken.sol";
import {AccessControlDefaultAdminRules} from "@openzeppelin/contracts/access/extensions/AccessControlDefaultAdminRules.sol";
import {Multicall} from "@openzeppelin/contracts/utils/Multicall.sol";

contract UnlimitedSupplyToken is
    IUnlimitedSupplyToken,
    ERC20,
    AccessControlDefaultAdminRules,
    Multicall
{
    bytes32 public immutable override MINTER = keccak256("MINTER");
    bytes32 public immutable override BURNER = keccak256("BURNER");

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) AccessControlDefaultAdminRules(0, msg.sender) {}

    function mint(
        address account,
        uint256 amount
    ) external override onlyRole(MINTER) {
        _mint(account, amount);
    }

    function burn(
        address account,
        uint256 amount
    ) external override onlyRole(BURNER) {
        _burn(account, amount);
    }
}
