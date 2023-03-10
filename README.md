# Commit-and-Reveal Scheme in Solidity

- solc: 0.6.12

# Test

```bash
$ npx hardhat node
```

```bash
$ npx hardhat test benchmark/CommitReveal.js --network localhost

  CommitReveal
    Normal
Tester:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Deploy CommitReveal:     0x129955157BE2622EbB0a7bEBC990216C63069973
      ✓ Commit Hash (38734054 gas)
      ✓ Reveal Hash (71372250 gas)
    Hashed
      ✓ Commit Hash (36884859 gas)
      ✓ Reveal Hash (38856806 gas)

·----------------------------------|---------------------------|-------------|----------------------------·
|       Solc version: 0.6.12       ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 6718946 gas  │
···································|···························|·············|·····························
|  Methods                                                                                                │
·················|·················|·············|·············|·············|··············|··············
|  Contract      ·  Method         ·  Min        ·  Max        ·  Avg        ·  # calls     ·  usd (avg)  │
·················|·················|·············|·············|·············|··············|··············
|  CommitReveal  ·  commit         ·      44825  ·      62072  ·      45732  ·         820  ·          -  │
·················|·················|·············|·············|·············|··············|··············
|  CommitReveal  ·  commit_hashed  ·      44861  ·      44897  ·      44895  ·         820  ·          -  │
·················|·················|·············|·············|·············|··············|··············
|  CommitReveal  ·  reveal         ·      27831  ·     796620  ·      87124  ·         820  ·          -  │
·················|·················|·············|·············|·············|··············|··············
|  CommitReveal  ·  reveal_hashed  ·      47355  ·      47391  ·      47389  ·         819  ·          -  │
·················|·················|·············|·············|·············|··············|··············
|  Deployments                     ·                                         ·  % of limit  ·             │
···································|·············|·············|·············|··············|··············
|  CommitReveal                    ·          -  ·          -  ·     691625  ·      10.3 %  ·          -  │
·----------------------------------|-------------|-------------|-------------|--------------|-------------·

  4 passing (7m)
```
