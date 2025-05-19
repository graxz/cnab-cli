import chalk from 'chalk';
import { fileURLToPath } from 'url';
import path from 'path';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

__dirname = __dirname.replace('services', 'entry');

export default async function searchService(argv) {
  const { from, to, segments } = argv;
  let { arquivo } = argv;
  const seg = segments.toUpperCase();

  if (arquivo && !arquivo.toLowerCase().endsWith('.rem')) {
    arquivo += '.rem';
  }

  const file = path.resolve(`${__dirname}/${arquivo || 'cnabExample.rem'}`);

  const messageLog = (linha, segmentoType, from, to) => `
    * Arquivo CNAB${!arquivo ? ' Padrão' : `: ${arquivo}`} *

    ----- Segmento ${segmentoType} -----

    From: ${chalk.inverse.bgBlack(from)}
    To: ${chalk.inverse.bgBlack(to)}

    Campo isolado: ${chalk.inverse.bgBlack(linha.substring(from - 1, to))}

    Linha com destaque:
      ${linha.substring(0, from)}${chalk.inverse.bgBlack(
    linha.substring(from - 1, to)
  )}${linha.substring(to)}

    ----- FIM -----
    `;

  try {
    console.time('leitura Async');
    const content = await readFile(file, 'utf8');
    const cnabArray = content.split('\n');

    const [cnabBodySegmentoP, cnabBodySegmentoQ, cnabBodySegmentoR] =
      cnabArray.slice(2, -2);

    if (seg === 'P')
      return console.log(messageLog(cnabBodySegmentoP, 'P', from, to));
    if (seg === 'Q')
      return console.log(messageLog(cnabBodySegmentoQ, 'Q', from, to));
    if (seg === 'R')
      return console.log(messageLog(cnabBodySegmentoR, 'R', from, to));

    console.log(`Segmento "${segmento}" inválido. Use "p", "q" ou "r".`);
  } catch (error) {
    console.error('Erro ao ler o arquivo:', error.message);
  } finally {
    console.timeEnd('leitura Async');
  }
}
