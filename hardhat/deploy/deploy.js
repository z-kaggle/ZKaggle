module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    await deploy('BountyFactory', {
        from: deployer,
        log: true
    });

    await deploy('Verifier', {
        from: deployer,
        log: true
    });
};
module.exports.tags = ['complete'];
