module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "webextensions": true,
        "jest/globals": true
    },
    "plugins": [
        "regexp",
        "jest",
    ],
    "extends": [
        "eslint:recommended",
        "plugin:regexp/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
    },
    "overrides": [
        {
            "files": [".eslintrc.js"],
            "env": {
                "node": true
            }
        }
    ]
}
