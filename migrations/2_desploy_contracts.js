// take the smart contract and put them on the blockchain
// truffle artifacts are JS (JSON) versions of the smart contract

// fetch and put on blockchain
// The EthSwap.sol file in this case
const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

// put them on the block chain
module.exports = async function(deployer) { //async since using await
    // Deploy Token
    await deployer.deploy(Token);
    const token = await Token.deployed();

    // Deploy EthSwap
    await deployer.deploy(EthSwap);
    const ethSwap = await EthSwap.deployed();

    // Transfer tokens to the Exchange
    // ... remember, first account in Ganache is deployer - who runs this code
    await token.transfer(ethSwap.address, '1000000000000000000000000')

};

// e.g. migration to change DB from one state to another
// truffle does same thing but for blockchains
// ... migrating smart contracts onto blockchain
