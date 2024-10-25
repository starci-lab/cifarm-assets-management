// SPDX-License-Identifier: 3.0
pragma solidity ^0.8.24;

import {INFT} from "./interfaces/INFT.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Multicall} from "@openzeppelin/contracts/utils/Multicall.sol";
import {AccessControlDefaultAdminRules} from "@openzeppelin/contracts/access/extensions/AccessControlDefaultAdminRules.sol";

contract NFT is
    INFT,
    ERC721URIStorage,
    ERC721Enumerable,
    AccessControlDefaultAdminRules,
    Multicall
{
    bytes32 public immutable override MINTER = keccak256("MINTER");
    bytes32 public immutable override UPDATER = keccak256("UPDATER");
    bytes32 public immutable override BURNER = keccak256("BURNER");

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) AccessControlDefaultAdminRules(0, msg.sender) {}

    function _baseURI() internal view virtual override returns (string memory) {
        return "https://ipfs.starci.net/ipfs/";
    }

    function mint(
        uint256 tokenId,
        address to,
        string memory _tokenURI
    ) external onlyRole(MINTER) {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
    }

    function updateTokenURI(
        uint256 tokenId,
        string memory _tokenURI
    ) external override onlyRole(UPDATER) {
        _setTokenURI(tokenId, _tokenURI);
    }

    function burn(uint256 tokenId) external override onlyRole(BURNER) {
        _burn(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(
            ERC721URIStorage,
            ERC721Enumerable,
            AccessControlDefaultAdminRules
        )
        returns (bool)
    {
        return (ERC721.supportsInterface(interfaceId));
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 amount
    ) internal virtual override(ERC721, ERC721Enumerable) {
        return super._increaseBalance(account, amount);
    }
}
