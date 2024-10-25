// SPDX-License-Identifier: 3.0
pragma solidity ^0.8.24;

interface INFTMarketplaceErrors {
    error SenderNotSeller(address sender);
    error SenderIsSeller(address sender);
}
