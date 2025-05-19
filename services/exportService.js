import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

__dirname = __dirname.replace('services', 'entry');

export default async function exportService(argv) {
  let { arquivo } = argv;

  if (arquivo && !arquivo.toLowerCase().endsWith('.rem')) {
    arquivo += '.rem';
  }

  const file = path.resolve(`${__dirname}/${arquivo || 'cnabExample.rem'}`);

  const messageLog = (cnabArrayFiltered) => {
    const jsonContent = JSON.stringify(cnabArrayFiltered, null, 2);

    const fileName = `./output/${Date.now()}-export.json`;

    fs.writeFileSync(fileName, jsonContent, 'utf8');

    return `
    * Arquivo CNAB${!arquivo ? ' Padrão' : `: ${arquivo}`} *

    Arquivo JSON ${fileName} gerado com informações sobre as empresas!

    ----- FIM -----
    `;
  };

  try {
    console.time('leitura Async');
    const content = await readFile(file, 'utf8');
    const cnabArray = content.split('\n');
    const cnabArrayOnlyQ = [];
    const cnabArrayData = [];

    cnabArray.filter((line) => {
      if (line[13] === 'Q') cnabArrayOnlyQ.push(line);
    });

    for (const line of cnabArrayOnlyQ) {
      const cnpj = line.slice(18, 32).trim();
      const companyName = line.slice(33, 73).trim();
      const address = line.slice(73, 113).trim();
      const neighborhood = line.slice(113, 128).trim();
      const cep = line.slice(128, 133).trim() + line.slice(133, 136).trim();
      const city = line.slice(136, 151).trim();
      const state = line.slice(151, 153).trim();

      cnabArrayData.push({
        empresa: { valor: companyName, posicao: [33, 73] },
        cnpj: { valor: cnpj, posicao: [18, 32] },
        cep: { valor: cep, posicao: [128, 136] },
        endereco: { valor: address, posicao: [73, 113] },
        bairro: { valor: neighborhood, posicao: [113, 128] },
        cidade: { valor: city, posicao: [136, 151] },
        estado: { valor: state, posicao: [151, 153] },
      });
    }

    const seen = new Set();
    const cnabArrayDataFiltered = cnabArrayData.filter((cnab) => {
      const name = cnab.empresa.valor;

      if (seen.has(name)) return false;

      seen.add(name);

      return true;
    });

    return console.log(messageLog(cnabArrayDataFiltered));
  } catch (error) {
    console.error('Erro ao ler o arquivo:', error.message);
  } finally {
    console.timeEnd('leitura Async');
  }
}
