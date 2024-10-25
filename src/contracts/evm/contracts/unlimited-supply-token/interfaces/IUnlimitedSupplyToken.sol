// SPDX-License-Identifier: 3.0
pragma solidity ^0.8.24;

import {IUnlimitedSupplyTokenWrite} from "./IUnlimitedSupplyTokenWrite.sol";
import {IUnlimitedSupplyTokenEvents} from "./IUnlimitedSupplyTokenEvents.sol";
import {IUnlimitedSupplyTokenRead} from "./IUnlimitedSupplyTokenRead.sol";

interface IUnlimitedSupplyToken is
    IUnlimitedSupplyTokenWrite,
    IUnlimitedSupplyTokenRead,
    IUnlimitedSupplyTokenEvents
{}
