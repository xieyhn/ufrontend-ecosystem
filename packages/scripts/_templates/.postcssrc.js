module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 1,
      propList: ['*'],
      exclude: ['node_modules']
    }
  }
}
