/* eslint-disable no-undef */
const IntelligibleIdentity = artifacts.require('IntelligibleIdentity.sol');

contract('IntelligibleIdentity', (accounts) => {
  var owner = accounts[0];
  var alice = accounts[1];
  var bob = accounts[2];

  it('should create a intelligible identity for alice', async () => {
    const token = await IntelligibleIdentity.deployed();
    const res = await token.newIdentity(alice, web3.utils.asciiToHex('uri'), {
      from: owner,
    });
    const tokenId = res.logs[0].args.tokenId;
    assert.equal(tokenId, '1', 'Token was not correctly minted');
  });

  it('should reserve an id and then create a intelligible identity for alice', async () => {
    const token = await IntelligibleIdentity.deployed();
    const resRes = await token.reserveIds(1, {
      from: owner,
    });
    const tokenId = resRes.logs[0].args.firstReservedId;
    assert.equal(tokenId, '2', 'Id was not correctly reserved');

    await token.newIdentityFromReserved(
      alice,
      web3.utils.asciiToHex('uri'),
      tokenId,
      {
        from: owner,
      }
    );
    aal = await token.balanceOf(alice);
    assert.equal(aal, '2', 'Token was not correctly minted');
  });

  it('should reserve two ids and then create two intelligible identity for alice', async () => {
    const token = await IntelligibleIdentity.deployed();
    const resRes = await token.reserveIds(2, {
      from: owner,
    });
    const firstTokenId = resRes.logs[0].args.firstReservedId;
    const lastTokenId = resRes.logs[0].args.lastReservedId;
    assert.equal(firstTokenId, '3', 'Id was not correctly reserved');
    assert.equal(lastTokenId, '4', 'Id was not correctly reserved');

    await token.newIdentityFromReserved(
      alice,
      web3.utils.asciiToHex('uri'),
      firstTokenId,
      {
        from: owner,
      }
    );
    await token.newIdentityFromReserved(
      alice,
      web3.utils.asciiToHex('uri'),
      lastTokenId,
      {
        from: owner,
      }
    );
    aal = await token.balanceOf(alice);
    assert.equal(aal, '4', 'Token was not correctly minted');
  });

  it('should create two intelligible identity for alice with reserve and two for bob without', async () => {
    const token = await IntelligibleIdentity.deployed();
    // Bob first
    const resBob1 = await token.newIdentity(bob, web3.utils.asciiToHex('uri'), {
      from: owner,
    });
    const tokenId1 = resBob1.logs[0].args.tokenId;
    assert.equal(tokenId1, '5', 'Token was not correctly minted');

    // Alice reserve
    const resRes = await token.reserveIds(2, {
      from: owner,
    });
    const firstTokenId = resRes.logs[0].args.firstReservedId;
    const lastTokenId = resRes.logs[0].args.lastReservedId;
    assert.equal(firstTokenId, '6', 'Id was not correctly reserved');
    assert.equal(lastTokenId, '7', 'Id was not correctly reserved');

    // Bob first
    const resBob2 = await token.newIdentity(bob, web3.utils.asciiToHex('uri'), {
      from: owner,
    });
    const tokenId2 = resBob2.logs[0].args.tokenId;
    assert.equal(tokenId2, '8', 'Token was not correctly minted');

    // Alice tokens
    await token.newIdentityFromReserved(
      alice,
      web3.utils.asciiToHex('uri'),
      firstTokenId,
      {
        from: owner,
      }
    );
    await token.newIdentityFromReserved(
      alice,
      web3.utils.asciiToHex('uri'),
      lastTokenId,
      {
        from: owner,
      }
    );

    // Finale balances
    aal = await token.balanceOf(alice);
    bal = await token.balanceOf(bob);
    assert.equal(aal, '6', 'Token was not correctly minted');
    assert.equal(bal, '2', 'Token was not correctly minted');
  });
});
