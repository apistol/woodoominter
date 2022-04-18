const { infuraProjectId, mnemonic, etherscanApiKey } = require('./secrets.json');

require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {

  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${infuraProjectId}`,
      accounts: {mnemonic: mnemonic}
    }
  },

  etherscan: {
    apiKey: etherscanApiKey
  },
  solidity: "0.6.12"
};

module.exports = {
  solidity: "0.8.9",
};


// npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS 0xb24EAc3AAD94B42Dd5ddffC927054f29b7451424x
// npx hardhat verify --network mainnet 0xb24EAc3AAD94B42Dd5ddffC927054f29b7451424x