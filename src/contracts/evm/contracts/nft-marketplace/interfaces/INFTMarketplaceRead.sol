// SPDX-License-Identifier: 3.0
pragma solidity ^0.8.24;

interface INFTMarketplaceRead {
    function FEE_MANAGER() external returns (bytes32);

    function feeTo() external returns (address);

    function feeRate() external returns (uint256);

    function token() external returns (address);

    function nft() external returns (address);

    struct Listing {
        address seller;
        uint256 price;
    }

    function listings(
        uint256 tokenId
    ) external returns (address seller, uint256 price);
}
