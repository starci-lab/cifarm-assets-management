// SPDX-License-Identifier: 3.0
pragma solidity ^0.8.24;

interface INFTMarketplaceEvents {
    event FeeRateUpdated(uint256 feeRate);
    event FeeToUpdated(address feeTo);
    event List(uint256 indexed tokenId, address seller, uint256 price);
    event Unlist(uint256 indexed tokenId);
    event PriceUpdated(uint256 indexed tokenId, uint256 price);
    event Buy(uint256 indexed tokenId, address buyer, uint256 price);
}
