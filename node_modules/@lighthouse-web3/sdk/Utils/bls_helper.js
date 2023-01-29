let bls = null;
if (typeof window === "undefined") {
  bls = eval("require")("bls-eth-wasm");
} else{
  bls = require("bls-eth-wasm/browser");
}

const k = 3;
const n = 5;


module.exports.getKeyShades = async (secKey) => {
  let msk = [];
  let idVec = [];
  let secVec = [];
  // let pubVec = [];
  // let sigVec = [];

  await bls.init(bls.BLS12_381);

  /*
  setup master secret key
  */
  let masterKey = new bls.SecretKey();
  masterKey.deserializeHexStr(secKey);

  //index 0 of msk most be the secret key you want to shade
  msk.push(masterKey);

  // other members of the array ingredients used in the algorithm
  for (let i = 0; i < k - 1; i++) {
    let sk = new bls.SecretKey();
    sk.setByCSPRNG();
    msk.push(sk);
  }

  /*
  key sharing
  */
  for (let i = 0; i < n; i++) {
    //create random Vector ID(points on the ECC)
    let id = new bls.Id();
    id.setByCSPRNG();
    idVec.push(id);

    //Create a secKey Shade
    let sk = new bls.SecretKey();
    sk.share(msk, idVec[i]);
    secVec.push(sk);
  }

  //Convert vector in to readable hex values
  var secData = secVec.map((sk) => sk.serializeToHexStr());
  var idData = idVec.map((id) => id.serializeToHexStr());
  return { keyShades: secData, idData: idData };
};

module.exports.recoverKey = async (keyShades, ids) => {
  let idVec = [];
  let secVec = [];
  await bls.init(bls.BLS12_381);

  for (let i = 0; i < keyShades.length; i++) {
    let sk = new bls.SecretKey();
    //convert readable string into secretKey vectors
    sk.deserializeHexStr(keyShades[i]);
    secVec.push(sk);

    //convert readable string into Id vectors
    let id = new bls.Id();
    id.deserializeHexStr(ids[i]);
    idVec.push(id);
  }
  const sec = new bls.SecretKey();

  //recover key
  sec.recover(secVec, idVec);
  let s = sec.serializeToHexStr();
  return s;
};

function randRange(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}
module.exports.randSelect = (k, n) => {
  const a = [];
  let prev = -1;
  for (let i = 0; i < k; i++) {
    let v = randRange(prev + 1, n - (k - i) + 1);
    a.push(v + 1);
    prev = v;
  }
  return a;
};