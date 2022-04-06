// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

abstract contract ReservedCounter is Context {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _ids;

    mapping(uint256 => address) private _reserved;

    event Reserved(
        address indexed owner,
        uint256 indexed firstReservedId,
        uint256 indexed lastReservedId
    );

    event Freed(address indexed exOwner, uint256 indexed freedId);

    function reserveIds(uint256 numOfReserved) public returns (uint256) {
        require(numOfReserved > 0, "ReservedCounter: cannot reserve 0 ids");
        for (uint256 i = 0; i < numOfReserved; i++) {
            uint256 reservedId = _nextId();
            _reserved[reservedId] = _msgSender();
        }
        uint256 last = _ids.current();
        uint256 first = last.sub(numOfReserved.sub(1));

        emit Reserved(_reserved[first], first, last);

        return first;
    }

    function freeId(uint256 reservedId) public {
        require(
            _reserved[reservedId] != address(0),
            "ReservedCounter: this id is not reserved"
        );
        require(
            _reserved[reservedId] == _msgSender(),
            "ReservedCounter: this id is reserved to another address"
        );
        _reserved[reservedId] = address(0);
    }

    function _nextId() public returns (uint256) {
        _ids.increment();
        return _ids.current();
    }
}
