# CNAB CLI

Uma CLI com serviços com manipulação de dados baseado em arquivos CNAB.



## Instalação

Instale a CLI com npm

```bash
  npm install cnab-cli
  cd cnab-cli
```
    
## Documentação

#### Comando padrão
```bash
  node cli.js
```


#### Busca um campo específico por segmento em um arquivo CNAB 

```bash
  search -f 21 -t 34 -s p (arquivo padrão utilizado)
  search -f 21 -t 34 -s p -a cnabExample.rem (arquivo informado utilizado)
```

#### Busca todos os resultados com o segmento informado em um arquivo CNAB 

```bash
  segments -s p (arquivo padrão utilizado)
  segments -s p -a cnabExample.rem (arquivo informado utilizado)
```

#### Busca dados sobre a empresa informada em um arquivo CNAB 

```bash
  company -n NTT (arquivo padrão utilizado)
  company -n NTT -a cnabExample.rem (arquivo informado utilizado)
  company -n NTT -a cnabExample.rem -j true (além de utilizar o arquivo informado também salva em json o retorno)
```

#### Exporta os dados de cada empresa de um arquivo CNAB 

```bash
  export (arquivo padrão utilizado)
  export -a cnabExample.rem (arquivo informado utilizado)
```
