const lighthouse = require("..");

test("getFileInfo", async () => {
  const fileInfo = (await lighthouse.getFileInfo(
    "bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend34"
  )).data;

  expect(fileInfo).toHaveProperty("fileSizeInBytes");
  expect(fileInfo).toHaveProperty("encryption");
}, 20000);
