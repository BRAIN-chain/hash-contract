// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import {CommitReveal} from "./CommitReveal.sol";

contract CRHelper is CommitReveal {
    uint256 public gasUsed;

    function commit_hashed(
        bytes32 res, // hash of result
        // address addr, // address
        uint256 seed, // random value
        uint256 r // round
    ) public override returns (bytes32) {
        uint256 startGas = gasleft();

        super.commit_hashed(res, seed, r);

        gasUsed = startGas - gasleft();
    }

    function reveal_hashed(
        bytes32 res, // hash of result
        address addr, // address
        uint256 seed, // random value
        uint256 r // round
    ) public override returns (bool) {
        uint256 startGas = gasleft();

        super.reveal_hashed(res, addr, seed, r);

        gasUsed = startGas - gasleft();
    }

    function commit(
        bytes calldata res, // result
        // address addr, // address
        uint256 seed, // random value
        uint256 r // round
    ) public override returns (bytes32) {
        uint256 startGas = gasleft();

        super.commit(res, seed, r);

        gasUsed = startGas - gasleft();
    }

    function reveal(
        bytes calldata res, // result
        address addr, // address
        uint256 seed, // random value
        uint256 r // round
    ) public override returns (bool) {
        uint256 startGas = gasleft();

        super.reveal(res, addr, seed, r);

        gasUsed = startGas - gasleft();
    }
}
