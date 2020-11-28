module.exports = {
    plugins: {
      autoprefixer: {
        browsers: ['Android >= 4.0', 'iOS >= 8'],
      },
      'postcss-pxtorem': {
        rootValue: 37.5,    // 基准值: 1rem = 37.5px
        propList: ['*'],
      },
    },
};