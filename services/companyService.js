import { fileURLToPath } from 'url';
import { formatCNPJ } from '../helpers/formatters.js';
import fs from 'fs';
import path from 'path';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

__dirname = __dirname.replace('services', 'entry');

export default async function companyService(argv) {
  const { name, json } = argv;
  let { arquivo } = argv;

  if (arquivo && !arquivo.toLowerCase().endsWith('.rem')) {
    arquivo += '.rem';
  }

  const file = path.resolve(`${__dirname}/${arquivo || 'cnabExample.rem'}`);

  const messageLog = (
    positionFinded,
    companyName,
    cnpj,
    cep,
    address,
    neighborhood,
    city,
    state
  ) => {
    const infos = {
      empresa: { valor: companyName, posicao: [33, 73] },
      cnpj: { valor: cnpj, posicao: [18, 32] },
      cep: { valor: cep, posicao: [128, 136] },
      endereco: { valor: address, posicao: [73, 113] },
      bairro: { valor: neighborhood, posicao: [113, 128] },
      cidade: { valor: city, posicao: [136, 151] },
      estado: { valor: state, posicao: [151, 153] },
    };

    if (json) {
      const jsonContent = JSON.stringify(infos, null, 2);

      const fileName = `./output/${Date.now()}-company.json`;

      fs.writeFileSync(fileName, jsonContent, 'utf8');

      console.log(`Arquivo ${fileName} criado com sucesso!`);
    }

    return `
* Arquivo CNAB${!arquivo ? ' Padrão' : `: ${arquivo}`} *

----- Segmento Q -----

Encontrada na posição: ${positionFinded}

NOME DA EMPRESA: ${companyName}
CNPJ: ${formatCNPJ(cnpj)}

CEP: ${cep}
ENDEREÇO: ${address}
BAIRRO: ${neighborhood}
CIDADE: ${city}
ESTADO: ${state}

----- FIM -----
`;
  };

  try {
    console.time('leitura Async');
    const content = await readFile(file, 'utf8');
    const cnabArray = content.split('\n');
    const cnabArrayQ = [];

    let searchedCompany = name;

    cnabArray.filter((line) => {
      if (line[13] === 'Q') cnabArrayQ.push(line);
    });

    for (const line of cnabArrayQ) {
      if (line.toUpperCase().includes(name.toUpperCase())) {
        const cnpj = line.slice(18, 32).trim();
        const companyName = line.slice(33, 73).trim();
        const address = line.slice(73, 113).trim();
        const neighborhood = line.slice(113, 128).trim();
        const cep = line.slice(128, 133).trim() + line.slice(133, 136).trim();
        const city = line.slice(136, 151).trim();
        const state = line.slice(151, 153).trim();

        const positionFinded = line.indexOf(companyName);

        return console.log(
          messageLog(
            positionFinded,
            companyName,
            cnpj,
            cep,
            address,
            neighborhood,
            city,
            state
          )
        );
      }
    }

    console.log(
      `Empresa "${searchedCompany.toUpperCase()}" não encontrada no arquivo CNAB.`
    );
  } catch (error) {
    console.error('Erro ao ler o arquivo:', error.message);
  } finally {
    console.timeEnd('leitura Async');
  }
}
