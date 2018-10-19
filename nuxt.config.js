module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Versions Tool',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Submodules version tool' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#409EFF' },
  /*
  ** Build configuration
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '~assets/css/main.scss',
  ],
  plugins: [
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    'nuxt-element-ui',
  ],
  elementUI: {
    components: ['Table', 'TableColumn', 'Tabs', 'TabPane', 'Icon', 'Row', 'Col', 'Card', 'Container', 'Main'],
    locale: 'en',
  },
  axios: {
    proxy: true,
  },
  proxy: {
    '/artifactory/': 'http://artifactory.corp',
  },
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

