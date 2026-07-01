/**
 * CHEAR — Script de Obfuscação do main.js
 * Corre: node obfuscar.js
 * Resultado: main.js substituído por versão ilegível
 *
 * Instalar uma vez: npm install javascript-obfuscator
 */

const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'main.js');
const BACKUP = path.join(__dirname, 'main.backup.js');
const OUTPUT = path.join(__dirname, 'main.js');

// 1. Fazer backup do original
if (!fs.existsSync(BACKUP)) {
  fs.copyFileSync(INPUT, BACKUP);
  console.log('✓ Backup criado: main.backup.js');
}

// 2. Ler o ficheiro original
const sourceCode = fs.readFileSync(INPUT, 'utf8');

// 3. Obfuscar com configuração máxima
const obfuscated = JavaScriptObfuscator.obfuscate(sourceCode, {

  // Compactar o código numa linha
  compact: true,

  // Tornar o fluxo do código ilegível
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.85,

  // Inserir código morto (confunde quem tenta ler)
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,

  // Codificar strings em hex/unicode — impossível de ler
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.85,
  stringArrayRotate: true,
  stringArrayShuffle: true,

  // Codificar literais de número
  numbersToExpressions: true,

  // Transformar nomes de variáveis/funções em hexadecimal
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false, // Mantém nomes globais para não quebrar HTML

  // Dividir strings em partes
  splitStrings: true,
  splitStringsChunkLength: 8,

  // Protecção anti-debug (abre infinito de debugger no DevTools)
  debugProtection: true,
  debugProtectionInterval: 4000,

  // Desactiva console.log (remove logs de debug)
  disableConsoleOutput: true,

  // Auto-defesa: se o código for formatado/alterado, para de funcionar
  selfDefending: true,

  // Transformações adicionais
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
  simplify: true,

  // Compatibilidade browser
  target: 'browser',
  seed: 0,
  log: false,
});

// 4. Guardar o ficheiro obfuscado
fs.writeFileSync(OUTPUT, obfuscated.getObfuscatedCode(), 'utf8');

const originalSize = Buffer.byteLength(sourceCode, 'utf8');
const obfuscatedSize = Buffer.byteLength(obfuscated.getObfuscatedCode(), 'utf8');

console.log('✓ Obfuscação concluída!');
console.log(`  Original:   ${(originalSize / 1024).toFixed(1)} KB`);
console.log(`  Obfuscado:  ${(obfuscatedSize / 1024).toFixed(1)} KB`);
console.log('  main.js substituído com sucesso.');
console.log('  Para restaurar o original: cp main.backup.js main.js');
