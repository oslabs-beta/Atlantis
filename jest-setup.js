module.exports = async () => {
  global.testServer = await require('./server.ts');
};
