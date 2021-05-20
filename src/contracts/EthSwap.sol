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

    // to keep transparency
    event TokensPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    // to keep transparency
    event TokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

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

        // ensure exchange balance is sufficient for the sale
        require(token.balanceOf(address(this)) >= tokenAmount);

        // msg.sender = buyer address
        // transfer tokens to buyer
        token.transfer(msg.sender, tokenAmount);

        //emit event
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    // reverse of buying
    function sellTokens(uint _amount) public {
        // user can't sell more tokens than have: ERC-20 handles this as standard
        // only for tutorial purposes
        require(token.balanceOf(msg.sender) >= _amount);

        // Calculate amount of ETH to redeem
        uint etherAmount = _amount / rate;

        // require sufficient ETH at Exchange
        require(address(this).balance >= etherAmount);

        // Perform sale
        // transfer function native to ETH
        // can't call (transfer() on ERC-20 token on behalf of investor)
        token.transferFrom(msg.sender, address(this), _amount); // trasnfer
        msg.sender.transfer(etherAmount);

        emit TokensSold(msg.sender, address(token), _amount, rate);
    }
}
