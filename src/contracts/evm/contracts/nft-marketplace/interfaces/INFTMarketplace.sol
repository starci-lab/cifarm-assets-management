// SPDX-License-Identifier: 3.0
pragma solidity ^0.8.24;

import {INFTMarketplaceWrite} from "./INFTMarketplaceWrite.sol";
import {INFTMarketplaceEvents} from "./INFTMarketplaceEvents.sol";
import {INFTMarketplaceRead} from "./INFTMarketplaceRead.sol";
import {INFTMarketplaceErrors} from "./INFTMarketplaceErrors.sol";

interface INFTMarketplace is
    INFTMarketplaceWrite,
    INFTMarketplaceEvents,
    INFTMarketplaceRead,
    INFTMarketplaceErrors
{}
