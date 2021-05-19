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

contract('EthSwap', (accounts) => { //callback function
    //tests inside of here

    // ensure deployed
    describe('EthSwap deployment', async () => {
        it('contract has a name', async () => {
            let ethSwap = await EthSwap.new()
            const name = await ethSwap.name()
            assert.equal(name, 'EthSwap Instant Exchange')
        })
    })
})
