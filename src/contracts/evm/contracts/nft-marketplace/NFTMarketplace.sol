// SPDX-License-Identifier: 3.0
pragma solidity ^0.8.24;

import {AccessControlDefaultAdminRules} from "@openzeppelin/contracts/access/extensions/AccessControlDefaultAdminRules.sol";
import {INFTMarketplace} from "./interfaces/INFTMarketplace.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {Multicall} from "@openzeppelin/contracts/utils/Multicall.sol";

contract NFTMarketplace is
    INFTMarketplace,
    AccessControlDefaultAdminRules,
    IERC721Receiver,
    Multicall
{
    bytes32 public immutable override FEE_MANAGER = keccak256("FEE_MANAGER");
    address public override feeTo;
    uint256 public override feeRate = 300; //0.3%

    address public override token;
    address public override nft;

    mapping(uint256 => Listing) public override listings;

    constructor(
        address _token,
        address _nft
    ) AccessControlDefaultAdminRules(0, msg.sender) {
        token = _token;
        nft = _nft;
        feeTo = msg.sender;
    }

    // MODIFIERS

    // EXTERNAL WRITE FUNCTIONS
    function setFeeRate(
        uint256 _feeRate
    ) external override onlyRole(FEE_MANAGER) {
        feeRate = _feeRate;
        emit FeeRateUpdated(feeRate);
    }

    function setFeeTo(address _feeTo) external override onlyRole(FEE_MANAGER) {
        feeTo = _feeTo;
        emit FeeToUpdated(feeTo);
    }

    function list(uint256 tokenId, uint256 price) external override {
        IERC721(nft).safeTransferFrom(msg.sender, address(this), tokenId);

        Listing memory listing = Listing({price: price, seller: msg.sender});
        listings[tokenId] = listing;

        emit List(tokenId, msg.sender, price);
    }

    function unlist(uint256 tokenId) external override {
        Listing memory listing = listings[tokenId];
        if (msg.sender != listing.seller) {
            revert SenderNotSeller(msg.sender);
        }
        IERC721(nft).safeTransferFrom(address(this), msg.sender, tokenId);

        delete listings[tokenId];
        emit Unlist(tokenId);
    }

    function setPrice(uint256 tokenId, uint256 price) external override {
        Listing memory listing = listings[tokenId];
        if (msg.sender != listing.seller) {
            revert SenderNotSeller(msg.sender);
        }

        listing.price = price;
        listings[tokenId] = listing;

        emit PriceUpdated(tokenId, price);
    }

    function buy(uint256 tokenId) external {
        Listing memory listing = listings[tokenId];
        if (msg.sender == listing.seller) {
            revert SenderIsSeller(msg.sender);
        }

        IERC721(nft).safeTransferFrom(address(this), msg.sender, tokenId);

        uint256 fee = (listing.price * feeRate) / 100000;
        uint256 net = listing.price - fee;

        IERC20(token).transferFrom(msg.sender, listing.seller, net);
        IERC20(token).transferFrom(msg.sender, feeTo, fee);

        delete listings[tokenId];
        emit Buy(tokenId, msg.sender, listing.price);
    }

    // EXTERNAL READ FUNCTIONS

    // CALLBACKS
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
