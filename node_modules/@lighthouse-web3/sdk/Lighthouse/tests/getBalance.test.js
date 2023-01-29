const lighthouse = require("../../Lighthouse");

test("getBalance Main Case", async () => {
  const balance = (await lighthouse.getBalance(
    "0x487fc2fE07c593EAb555729c3DD6dF85020B5160"
  )).data;

  expect(typeof balance.dataLimit).toBe("number");
  expect(typeof balance.dataUsed).toBe("number");
}, 20000);

test("getBalance Null Case", async () => {
  try{
    const balance = await lighthouse.getBalance(
      "0x487fc2fE07c593EAb555729c3DD6dF85020B5133"
    );
  } catch(error){
    expect(typeof error.message).toBe("string");
  }
}, 20000);
