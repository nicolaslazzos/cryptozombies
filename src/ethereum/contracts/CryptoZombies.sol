pragma solidity ^0.4.25;

import "./zombieownership.sol";

contract CryptoZombies is ZombieOwnership {
  function kill() public onlyOwner {
    selfdestruct(msg.sender);
  }
}
