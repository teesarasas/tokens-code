import StyleDictionary from 'style-dictionary';

// Identify token tier based on file path
const getTokenTier = (filePath) => {
  if (filePath.includes('semantic')) return 'semantic';
  if (filePath.includes('component')) return 'component';
  return null;
};

StyleDictionary.registerFormat({
  name: 'css/custom-variables',
  format: function ({ dictionary, platform }) {
    return `:root {
${dictionary.allTokens.map((token) => {
  const tokenName = token.name.replace(`${platform.prefix}-`, '');
  const tier = getTokenTier(token.filePath);
  if (tier) {
    return `  --${platform.prefix}-${tier}-${tokenName}: ${token.value};`;
  }
  return `  --${platform.prefix}-${tokenName}: ${token.value};`;
}).join('\n')}
}`;
  }
});

export default {
  "source": ["tokens/**/*.json"],
  "platforms": {
    "css": {
      "prefix": "ds",
      "transformGroup": "css",
      "buildPath": "build/css/",
      "files": [
        {
          "destination": "_variables.css",
          "format": "css/custom-variables"
        }
      ]
    }
  }
};