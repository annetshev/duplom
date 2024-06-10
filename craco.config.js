module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          http: require.resolve("stream-http"),
          https: require.resolve("https-browserify"),
          stream: require.resolve("stream-browserify"),
          crypto: require.resolve("crypto-browserify"),
          buffer: require.resolve("buffer"),
          assert: require.resolve("assert"),
          zlib: require.resolve("browserify-zlib"),
          url: require.resolve("url"),
          querystring: require.resolve("querystring-es3"),
          path: require.resolve("path-browserify"),
          fs: false,
        },
      },
    },
  },
};
