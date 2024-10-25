// SPDX-License-Identifier: 3.0
pragma solidity ^0.8.24;

interface INFTMarketplaceWrite {
    function setFeeRate(uint256 feeRate) external;

    function setFeeTo(address feeTo) external;

    function list(uint256 tokenId, uint256 price) external;

    function unlist(uint256 tokenId) external;

    function setPrice(uint256 tokenId, uint256 price) external;

    function buy(uint256 tokenId) external;
}
