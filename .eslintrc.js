module.exports = {
  extends: 'airbnb-base',
  rules: {
    'no-console': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'no-param-reassign': ['error', { props: false }],
    'comma-dangle': ['error', 'never'],
  },
  globals: {
    alterState: 'readonly',
    execute: 'readonly',
    field: 'readonly',
    fields: 'readonly',
    dataValue: 'readonly',
    dataPath: 'readonly',
    post: 'readonly',
    each: 'readonly',
    combine: 'readonly',
  },
};
