/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    env: {
        node: true
    },
    parser: '@typescript-eslint/parser',
    extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', '@vue/eslint-config-prettier', 'plugin:@typescript-eslint/recommended'],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    plugins: ['vue', '@typescript-eslint'],
    rules: {
        'vue/multi-word-component-names': 'off',
        'vue/no-reserved-component-names': 'off',
        semi: ['error', 'never'],
        'vue/component-tags-order': [
            'error',
            {
                order: ['script', 'template', 'style']
            }
        ]
    }
}
