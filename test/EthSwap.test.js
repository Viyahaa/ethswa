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

// deployer = receiver
// investor = sender
contract('EthSwap', ([deployer, investor]) => { //callback function
    //tests inside of here

    let token, ethSwap // make these variables public

    // before hook
        // in here the set up declerations
        // ... i.e. what stuff is in start of every test
        // ... reduces code duplication

    before(async () => {
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)
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

    describe('buyTokens()', async () => {
        let result

        before(async () => {
            result = await ethSwap.buyTokens({from: investor, value: web3.utils.toWei('1', 'ether')})
        })

        it('Allows user to instantly purchase tokens from EthSwap for a fixed price', async () => {
            // check investor balance increase
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100')) // as 100 is redemption rate for 1 ETH

            // check EthSwap balance
            let ethSwapBalance
            // check eth balance of tokens decrease
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('999900'))
            // check eth balance of eth increase
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'Ether'))

            // ensures emit is correct
            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')
        })
    })

    describe('sellTokens()', async () => {
        let result

        before(async () => {
            // investor must approve tokens before purchase
            await token.approve(ethSwap.address, tokens('100'), {from: investor})
            result = await ethSwap.sellTokens(tokens('100'), {from: investor})
        })

        it('Allows user to instantly sell tokens to EthSwap for a fixed price', async () => {
            // check investor token balance after sale
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('0'))

            // check EthSwap balance
            let ethSwapBalance
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('1000000'))
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'Ether'))

            // ensures emit is correct
            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')

            //FAILURE: investor can't sell more tokens than available
            await ethSwap.sellTokens(tokens('500'), {from: investor}).should.be.rejected;
        })
    })
})
