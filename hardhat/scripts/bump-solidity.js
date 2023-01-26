const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/
const inputRegex = /uint\[\d+\] memory input(?!;)/
const contentRegex = /proof\.C = Pairing\.G1Point\(c\[0\], c\[1\]\);([\s\S]*?)if \(verify\(inputValues, proof\) == 0\)/

let content = fs.readFileSync("./contracts/verifier.sol", { encoding: 'utf-8' });
let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.17');
bumped = bumped.replace(inputRegex, 'uint[] memory input');
bumped = bumped.replace(contentRegex, 'proof.C = Pairing.G1Point(c[0], c[1]);\n\n        if (verify(input, proof) == 0)');

fs.writeFileSync("./contracts/verifier.sol", bumped);
