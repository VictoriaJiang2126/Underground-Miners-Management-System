const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  // assetsDir: 'static',
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src')).set('lin', resolve('src/lin')).set('assets', resolve('src/assets'))
    config.module.rule('ignore').test(/\.md$/).use('ignore-loader').loader('ignore-loader').end()
  },
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.json', '.vue', '.scss', '.html'],
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/style/shared.scss";`,
      },
    },
  },
  devServer: {
    proxy: {
      // 配置公共代理
      // '/api': {
      //   target: 'http://39.107.137.49:8090', //这里的是.cn还是.com 只会影响你本地启动项目时候会调用哪个数据库的数据，而不会影响测试和线上环境调用对应的接口的。（一般都是本地调用.cn；等本地需要调试线上bug时候，改成.com重启项目看线上bug）
      //   changeOrigin: true, //是否跨域
      //   secure: false, //如果是https请求 需要设置为true
      //   pathRewrite: {
      //     "^/api": "39.107.137.49:8090"
      //   },
      //   //ws: true,//是否要代理 websocket
      // },

      // 配置公共代理
      // '/api': {
      //   target: 'http://localhost:8090', //这里的是.cn还是.com 只会影响你本地启动项目时候会调用哪个数据库的数据，而不会影响测试和线上环境调用对应的接口的。（一般都是本地调用.cn；等本地需要调试线上bug时候，改成.com重启项目看线上bug）
      //   changeOrigin: true, //是否跨域
      //   secure: false, //如果是https请求 需要设置为true
      //   pathRewrite: {
      //     "^/api": "http://39.107.137.49:8090"
      //   },
      //   //ws: true,//是否要代理 websocket
      // },

    },
  },
  // node_modules依赖项es6语法未转换问题
  transpileDependencies: ['vuex-persist'],

}
