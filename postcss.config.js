let plugins = [
      require('autoprefixer'),
      require('postcss-sort-media-queries')
    ]
module.exports = ({ env }) => {
  if (env === 'production')
    plugins.push(require('cssnano'));
  return { plugins: plugins }
}
