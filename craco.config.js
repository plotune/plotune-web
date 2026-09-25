const remarkFrontmatter = require('remark-frontmatter').default;
const remarkGfm = require('remark-gfm').default;

module.exports = {
  webpack: {
    configure: (config) => {
      const oneOfRule = config.module.rules.find((rule) => Array.isArray(rule.oneOf));

      if (!oneOfRule) {
        console.warn('[craco.config.js] Expected webpack "oneOf" rule group not found (react-scripts internals may have changed). Skipping MDX loader setup; .mdx imports will fail until this config is updated for the new rule shape.');
        return config;
      }

      oneOfRule.oneOf.unshift({
        test: /\.mdx?$/,
        use: [
          { loader: require.resolve('babel-loader'), options: { presets: [require.resolve('babel-preset-react-app')] } },
          { loader: require.resolve('@mdx-js/loader'), options: { providerImportSource: '@mdx-js/react', remarkPlugins: [remarkFrontmatter, remarkGfm] } },
        ],
      });
      config.resolve.extensions.push('.mdx');
      return config;
    },
  },
};
