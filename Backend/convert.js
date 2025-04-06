const { ethers } = require("ethers");

// Your private key as a string
const privateKey = "4f3b1787a928cde524fca78bdb70ad6cc2d9a17e5493dde32e5063dfc1ea5b1f";

// Convert to Uint8Array
const privateKeyUint8 = ethers.utils.arrayify(`0x${privateKey}`);

// Output as Uint8Array
console.log(privateKeyUint8);
