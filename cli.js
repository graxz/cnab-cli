'use strict';

import companyService from './services/companyService.js';
import exportService from './services/exportService.js';
import { hideBin } from 'yargs/helpers';
import searchService from './services/searchService.js';
import segmentsService from './services/segmentsService.js';
import yargs from 'yargs';

yargs(hideBin(process.argv))
  .command(
    'search',
    'Busca um campo específico por segmento em um arquivo CNAB',
    (yargs) => {
      return yargs
        .option('a', {
          alias: 'arquivo',
          describe: 'Arquivo CNAB a ser utilizado',
          type: 'string',
          global: true,
        })
        .option('f', {
          alias: 'from',
          describe: 'Posição inicial na linha do CNAB',
          type: 'number',
          demandOption: true,
        })
        .option('t', {
          alias: 'to',
          describe: 'Posição final na linha do CNAB',
          type: 'number',
          demandOption: true,
        })
        .option('s', {
          alias: 'segments',
          describe: 'Tipo de segmento (p, q ou r)',
          type: 'string',
          demandOption: true,
        })
        .example(
          '$0 search -f 21 -t 34 -s p -a cnabExample.rem',
          'Busca conteúdo entre posições 21 e 34 do segmento P'
        );
    },
    async (argv) => {
      return searchService(argv);
    }
  )
  .command(
    'segments',
    'Busca todos os resultados com o segmento informado',
    (yargs) => {
      return yargs
        .option('a', {
          alias: 'arquivo',
          describe: 'Arquivo CNAB a ser utilizado',
          type: 'string',
          global: true,
        })
        .option('s', {
          alias: 'segments',
          describe: 'Tipo de segmento (p, q ou r)',
          type: 'string',
          demandOption: true,
        })
        .example(
          '$0 segments -s p -a cnabExample.rem',
          'Busca todos do segmento P'
        );
    },
    async (argv) => {
      return segmentsService(argv);
    }
  )
  .command(
    'company',
    'Busca dados sobre a empresa informada',
    (yargs) => {
      return yargs
        .option('a', {
          alias: 'arquivo',
          describe: 'Arquivo CNAB a ser utilizado',
          type: 'string',
          global: true,
        })
        .option('j', {
          alias: 'json',
          describe: 'Salva em um arquivo json as informações buscadas',
          type: 'boolean',
          demandOption: false,
        })
        .option('n', {
          alias: 'name',
          describe: 'Nome da empresa a ser buscada',
          type: 'string',
          demandOption: true,
        })
        .example(
          '$0 company -n NTT -a cnabExample.rem',
          'Busca informações sobre a empresa informada'
        );
    },
    async (argv) => {
      return companyService(argv);
    }
  )
  .command(
    'export',
    'Exporta os dados para cada empresa',
    (yargs) => {
      return yargs
        .option('a', {
          alias: 'arquivo',
          describe: 'Arquivo CNAB a ser utilizado',
          type: 'string',
          global: true,
        })
        .example(
          '$0 export -a cnabExample.rem',
          'Exporta os dados de cada empresa baseado ou não no arquivo passado'
        );
    },
    async (argv) => {
      return exportService(argv);
    }
  )
  .demandCommand(1, 'Você precisa passar um comando, como "search"')
  .help()
  .strict()
  .parse();
