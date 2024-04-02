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
    const CommitReveal = await ethers.getContractFactory("CRHelper", signer.tester);
    contract.commitReveal = await CommitReveal.deploy();
    await contract.commitReveal.deployed();
    console.log(":\t", contract.commitReveal.address);
  }

  async function result(gasUsed) {
    let gasUsedFloat = gasUsed.map((e) => {
      return ethers.FixedNumber.fromString(e.toString());
    })

    let sum = new ethers.BigNumber.from(0);
    let minGasUsed = gasUsed[0];
    let maxGasUsed = gasUsed[0];
    let averageGasUsed;
    let sdGasUsed;
    let medianGasUsed;

    // Calculate min, max, and sum
    for (let num of gasUsed) {
      if (num.lt(minGasUsed)) minGasUsed = num;
      if (num.gt(maxGasUsed)) maxGasUsed = num;
      sum = sum.add(num);
    }

    // Calculate average
    averageGasUsed =
      ethers.FixedNumber.fromString(sum.toString())
        .divUnsafe(ethers.FixedNumber.from(gasUsed.length));

    // Calculate standard deviation
    const ONE = ethers.FixedNumber.from(1);
    const TWO = ethers.FixedNumber.from(2);
    function sqrt(value) {
      x = ethers.FixedNumber.from(value);
      let z = x.addUnsafe(ONE).divUnsafe(TWO);
      let y = x;
      while (z.subUnsafe(y).isNegative()) {
        y = z;
        z = x.divUnsafe(z).addUnsafe(z).divUnsafe(TWO);
      }
      return y.divUnsafe(ethers.FixedNumber.from(10 ** 9));
    }

    const varGasUsed = (gasUsedFloat.reduce(
      (p, c) => {
        return p.addUnsafe(
          (c.subUnsafe(averageGasUsed))
            .mulUnsafe(c.subUnsafe(averageGasUsed))
        )
      },
      new ethers.FixedNumber.from(0)
    )).divUnsafe(ethers.FixedNumber.from(gasUsedFloat.length));
    sdGasUsed = sqrt(varGasUsed);

    // Calculate median
    function compareBigNumbers(a, b) {
      if (a.gt(b)) {
        return 1;
      } else if (a.lt(b)) {
        return -1;
      } else {
        return 0;
      }
    }
    gasUsed.sort(compareBigNumbers);
    if (gasUsed.length % 2 === 0) {
      let mid1 = gasUsed[gasUsed.length / 2 - 1];
      let mid2 = gasUsed[gasUsed.length / 2];
      medianGasUsed =
        ethers.FixedNumber.fromString(mid1.toString())
          .addUnsafe(ethers.FixedNumber.fromString(mid2.toString()))
          .divUnsafe(ethers.FixedNumber.from(2));
    } else {
      medianGasUsed = gasUsed[Math.floor(gasUsed.length / 2)];
    }

    // console.log(gasUsed);
    console.log(`Min: ${minGasUsed}`);
    console.log(`Max: ${maxGasUsed}`);
    console.log(`Average (std): ${averageGasUsed} (${sdGasUsed} = sqrt(${varGasUsed}))`);
    console.log(`Median: ${medianGasUsed}`);
  }

  round = 0;
  temp_round = round;

  describe("Normal", function () {
    it("Commit Hash", async function () {
      await set();
      await deploy();

      let gasUsed = [];

      for (d of data) {
        input = await contract.commitReveal.stringToBytes(d);

        let txRes = await contract.commitReveal.commit(
          input,
          950327,
          round
        );
        await txRes.wait();

        gasUsed.push(await contract.commitReveal.gasUsed());

        round += 1;
      }

      result(gasUsed);
    });
    it("Reveal Hash", async function () {
      let gasUsed = [];

      for (d of data) {
        input = await contract.commitReveal.stringToBytes(d);

        let txRes = await contract.commitReveal.reveal(
          input,
          signer.tester.address,
          950327,
          temp_round
        );
        await txRes.wait();

        gasUsed.push(await contract.commitReveal.gasUsed());

        await contract.commitReveal.saved_commits(temp_round, signer.tester.address);
        expect(txRes).to.equal(txRes);

        temp_round += 1;
      }

      result(gasUsed);
    });
  });

  temp_round = round;

  describe("Hashed", function () {
    it("Commit Hash", async function () {
      // await set();
      // await deploy();

      let gasUsed = [];

      for (d of data) {
        input = await contract.commitReveal.stringToBytes(d);
        hashed_input = await contract.commitReveal.hashString(input);

        let txRes = await contract.commitReveal.commit_hashed(
          hashed_input,
          950327,
          round
        );
        await txRes.wait();

        gasUsed.push(await contract.commitReveal.gasUsed());

        round += 1;
      }

      result(gasUsed);
    });
    it("Reveal Hash", async function () {
      let gasUsed = [];

      for (d of data) {
        input = await contract.commitReveal.stringToBytes(d);
        hashed_input = await contract.commitReveal.hashString(input);

        let txRes = await contract.commitReveal.reveal_hashed(
          hashed_input,
          signer.tester.address,
          950327,
          temp_round
        );
        await txRes.wait();

        gasUsed.push(await contract.commitReveal.gasUsed());

        await contract.commitReveal.saved_commits(temp_round, signer.tester.address);
        expect(txRes).to.equal(txRes);

        temp_round += 1;
      }

      result(gasUsed);
    });
  });
});
