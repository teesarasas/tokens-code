import StyleDictionary from 'style-dictionary';
// Utility to split a single tokens-code.json into multiple scoped files
import fs from 'fs';
import path from 'path';

const splitTokenFile = () => {
  const inputPath = path.join(process.cwd(), './tokens-code.json');
  const outputDir = path.join(process.cwd(), 'tokens');

  const rawTokens = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

  for (const fullKey in rawTokens) {
    if (!fullKey.includes('/')) continue;
    const [folder, file] = fullKey.split('/');
    const dirPath = path.join(outputDir, folder);
    const filePath = path.join(dirPath, `${file}.json`);
    const content = rawTokens[fullKey];

    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`✅ Saved ${filePath}`);
  }
};
splitTokenFile();

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