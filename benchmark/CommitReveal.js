const { expect } = require("chai");

const data = require("./inputs.json");

describe("CommitReveal", function () {
  let signer = {
    "tester": null
  };
  let contract = {
    "commitReveal": null
  };

  async function set(verbose = true) {
    [signer.tester] = await ethers.getSigners();

    let balanceOfTestter = await signer.tester.getBalance() / (10 ** 18);
    console.log("Tester:\t", signer.tester.address, `(${balanceOfTestter} ETH)`);
  }

  async function deploy() {
    process.stdout.write("Deploy CommitReveal");
    const CommitReveal = await ethers.getContractFactory("CommitReveal", signer.tester);
    contract.commitReveal = await CommitReveal.deploy();
    await contract.commitReveal.deployed();
    console.log(":\t", contract.commitReveal.address);
  }

  describe("Normal", function () {
    it("Commit Hash", async function () {
      await set();
      await deploy();

      round = 0
      for (d of data) {
        input = await contract.commitReveal.stringToBytes(d);

        let txRes = await contract.commitReveal.commit(
          input,
          950327,
          round
        );
        await txRes.wait();

        round += 1;
      }
    });
    it("Reveal Hash", async function () {
      round = 0
      for (d of data) {
        input = await contract.commitReveal.stringToBytes(d);

        let txRes = await contract.commitReveal.reveal(
          input,
          signer.tester.address,
          950327,
          round
        );
        await txRes.wait();

        await contract.commitReveal.saved_commits(round, signer.tester.address);
        expect(txRes).to.equal(txRes);

        round += 1;
      }
    });
  });

  describe("Hashed", function () {
    it("Commit Hash", async function () {
      await set();
      await deploy();

      round = 0
      for (d of data) {
        input = await contract.commitReveal.stringToBytes(d);
        hashed_input = await contract.commitReveal.hashString(input);

        let txRes = await contract.commitReveal.commit_hashed(
          hashed_input,
          950327,
          round
        );
        await txRes.wait();

        round += 1;
      }
    });
    it("Reveal Hash", async function () {
      round = 0
      for (d of data) {
        input = await contract.commitReveal.stringToBytes(d);
        hashed_input = await contract.commitReveal.hashString(input);

        let txRes = await contract.commitReveal.reveal_hashed(
          hashed_input,
          signer.tester.address,
          950327,
          round
        );
        await txRes.wait();

        await contract.commitReveal.saved_commits(round, signer.tester.address);
        expect(txRes).to.equal(txRes);

        round += 1;
      }
    });
  });
});
