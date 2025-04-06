const GitGainsEscrow = artifacts.require("GitGainsEscrow");

module.exports = function (deployer) {
  deployer.deploy(GitGainsEscrow);
};
