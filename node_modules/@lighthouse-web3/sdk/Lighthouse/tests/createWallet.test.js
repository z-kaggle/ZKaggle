const lighthouse = require("..");

test("createWallet", async () => {
  const wallet = (await lighthouse.createWallet("Uchihas")).data.encryptedWallet;
  console.log(wallet);
  const walletParse = JSON.parse(wallet);
  expect(walletParse).toHaveProperty("address");
}, 20000);

test("createWallet null", async () => {
  try{
    const wallet = await lighthouse.createWallet(null);
  } catch (error){
    expect(typeof error.message).toBe("string");
  }
}, 20000);
