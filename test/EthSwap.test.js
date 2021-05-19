// Importance in writing tests is not only efficiency of testing ...
// ... but also in that once deployed smart contracts are immutable

// ALL TESTS
// Truffle allows us to write tests for solidity in JS

// Truffle comes with libraries
// Mocha - create JS test suites
// Chai - compare / assertion tests

// import smart contract to then test it
const Token = artifacts.require('Token');
const EthSwap = artifacts.require('EthSwap');

// configure chai / assertions
require('chai')
    .use(require('chai-as-promised'))
    .should()

// this is for tokens not our ETH - as our DAPP is same standard as ETH
// transforms value from ETH form to Wei form
// Improves readability
function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('EthSwap', (accounts) => { //callback function
    //tests inside of here

    let token, ethSwap // make these variables public

    // before hook
        // in here the set up declerations
        // ... i.e. what stuff is in start of every test
        // ... reduces code duplication

    before(async () => {
        token = await Token.new()
        ethSwap = await EthSwap.new()
        await token.transfer(ethSwap.address, tokens('1000000'))
    })

    // describe starts a new chunk of tests
        //it starts a new specific test

    describe('Token deployment', async () => {
        it('contract has a name', async () => {
            const name = await token.name()
            assert.equal(name, 'DApp Token')
        })
    })

    describe('EthSwap deployment', async () => {
        it('contract has a name', async () => {
            const name = await ethSwap.name()
            assert.equal(name, 'EthSwap Instant Exchange')
        })

        it('contract has tokens', async () => {
            let balance = await token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

})
