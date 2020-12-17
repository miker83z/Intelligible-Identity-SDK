// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

//import "./ERC1948/ERC1948.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract IntelligibleIdentity is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    constructor(string memory name, string memory symbol)
        public
        ERC721(name, symbol)
    {}

    function newIdentity(address idAddress, string memory tokenURI)
        public
        returns (uint256)
    {
        uint256 newItemId = _newToken(idAddress, tokenURI);

        return newItemId;
    }

    function _newToken(address idAddress, string memory tokenURI)
        private
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(idAddress, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
