// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./ReservedCounter.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract IntelligibleCertificate is ERC721, ReservedCounter {
    constructor(string memory name, string memory symbol)
        public
        ERC721(name, symbol)
    {}

    function newCertificateFromReserved(
        address receivingAddress,
        string memory tokenURI,
        uint256 reservedId
    ) public {
        freeId(reservedId);
        _newToken(receivingAddress, tokenURI, reservedId);
    }

    function newCertificate(address receivingAddress, string memory tokenURI)
        public
        returns (uint256)
    {
        uint256 tokenId = _nextId();
        _newToken(receivingAddress, tokenURI, tokenId);

        return tokenId;
    }

    function _newToken(
        address receivingAddress,
        string memory tokenURI,
        uint256 tokenId
    ) private {
        _mint(receivingAddress, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }
}
