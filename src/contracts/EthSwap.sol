// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

import "./Token.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint public rate = 100;

    event TokenPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokenSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        // Redemption rate = # of tokens they receive for 1 ether.        
        // Amount of Etherium * Redemption Rate
        //Calculate no. of tokens to buy.
        uint tokenAmount = msg.value * rate;
        // Require that EthSwap has enough tokens
        require( token.balanceOf(address(this)) >= tokenAmount);
        
        // Transfer tokens to user
        token.transfer(msg.sender, tokenAmount);

        //Emit an event.
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public {
        // User can't sell more tokens than they have.
        require(token.balanceOf(msg.sender) >= _amount);
        //Calc the amount of ether to redeem.
        uint etherAmount = _amount / rate;

        //Require EthSwap has enough tokens.
        require(address(this).balance >= etherAmount);

        // Perform Sale
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

        // Emit an event
        emit TokenSold(msg.sender, address(token), _amount, rate);
    }
}

