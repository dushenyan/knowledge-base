import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',

  vue: true,

  typescript: true,

  jsonc: true,

  ignores: [
    'docs',
  ],
}, {
  rules: {
    'no-console': 'off',
    'vue/valid-template-root': 'off',
  },
})
