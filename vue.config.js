module.exports = {
    publicPath:
        process.env.NODE_ENV === "production"
            ? process.env.VUE_APP_PROD_URL
            : "/",
    transpileDependencies: ["vuetify", "android-fastboot"],
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /fastboot\.cjs$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    targets: {
                                        browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
                                    }
                                }]
                            ],
                            plugins: [
                                '@babel/plugin-transform-optional-chaining',
                                '@babel/plugin-transform-nullish-coalescing-operator'
                            ]
                        }
                    }
                }
            ]
        }
    },
    chainWebpack: (config) => {
        config.plugin("html").tap((args) => {
            args[0].title = `${process.env.VUE_APP_OS_NAME} web installer`;
            args[0].osName = process.env.VUE_APP_OS_NAME;
            args[0].osDesc = process.env.VUE_APP_OS_DESC;
            args[0].analyticsDomain = process.env.VUE_APP_SA_DOMAIN;
            return args;
        });
    },
};
