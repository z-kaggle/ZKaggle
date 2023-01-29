const lighthouse = require("..");

test("addCid main case", async () => {
  const response = await lighthouse.addCid(
    "adiyogi.jpg",
    "bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend34"
  );
  expect(response.data).toBe("Added To Queue");
}, 20000);

test("addCid null", async () => {
  try{
    const response = await lighthouse.addCid(
      "adiyogi.jpg",
      "bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend"
    );
  } catch(error){
    expect(typeof error.message).toBe("string");
  }
}, 20000);
