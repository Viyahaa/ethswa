// The EthSwap Smart Contract

pragma solidity ^0.5.0; //declares solidity version

import "./Token.sol";

// create smart contracts
contract EthSwap {
    // public to be able to read outside of the smart contract
    // public allows us to read the variable name
    string public name = "EthSwap Instant Exchange";
    Token public token; // gets just the code
    uint public rate = 100; // pre-determined exchange rate

    constructor(Token _token) public {
        token = _token; // writes to the blockchain, as address gets passed to here
    }

    // transfer from eth smart contract to buyer
    // public = to call it outside of the smart contract
    // payable = allows us to send ETH on each call
    function buyTokens() public payable {
        // redemption rate = # tokens they receive for 1 ETH
        // amount of ETH * redemption rate
        uint tokenAmount = msg.value * rate;
        // msg.sender = buyer address
        token.transfer(msg.sender, tokenAmount);
    }
}
