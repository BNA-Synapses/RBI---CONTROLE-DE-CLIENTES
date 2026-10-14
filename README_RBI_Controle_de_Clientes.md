# RBI Controle de Clientes

Aplicação web desenvolvida para resolver uma necessidade real da minha rotina de trabalho com logística reversa.

Durante a operação, percebi que o sistema utilizado para gerenciamento das ordens de serviço atendia ao controle formal das OS, mas não cobria de forma prática todo o acompanhamento que acontece entre o recebimento da ordem e a finalização da coleta.

No dia a dia, eu precisava localizar rapidamente clientes, relacionar telefone e contrato, acompanhar respostas, registrar o andamento de cada contato e saber quais coletas já haviam avançado. Com o aumento do volume de atendimentos simultâneos, manter esse controle de forma manual começou a gerar atrito na operação.

A partir dessa necessidade, criei o **RBI Controle de Clientes**: um CRUD simples, feito para organizar o meu próprio fluxo de trabalho.

O objetivo do projeto não é demonstrar um sistema complexo ou substituir a plataforma oficial utilizada na operação. A proposta é aplicar desenvolvimento web a um problema real, criando uma ferramenta pequena, útil e que possa evoluir conforme novas necessidades apareçam durante o uso.

## 🚀 Funcionalidades

- Cadastro de ordens/clientes
- Registro de nome, contrato, telefone e status
- Busca por nome, telefone ou contrato
- Edição de registros existentes
- Alteração do status da OS
- Remoção de registros
- Persistência local dos dados com `localStorage`
- Exportação da base para arquivo de backup
- Importação e restauração de backups
- Compatibilidade com backups legados da aplicação
- Interface responsiva

## 📌 Status utilizados

A aplicação permite acompanhar a OS pelos seguintes estados:

- **Novo** — registro recém-adicionado ao controle
- **Sem Resposta** — tentativa de contato realizada, mas ainda sem retorno
- **Respondido** — cliente já respondeu ao contato
- **Agendado** — coleta combinada com o cliente
- **Coletado** — equipamento já retirado
- **Removido** — OS marcada como removida no fluxo operacional

O status **Removido** é diferente da exclusão de um registro. A exclusão apaga o item da base local, enquanto o status permite manter o histórico daquela OS no controle.

## 💾 Persistência e backup

Os dados são armazenados no próprio navegador por meio do `localStorage`.

Essa escolha foi intencional: a ferramenta foi criada para auxiliar uma rotina operacional local e não depende de servidor ou banco de dados remoto para armazenar informações de clientes.

Como o `localStorage` pertence ao navegador em que a aplicação está sendo utilizada, foi implementado um sistema de backup portátil.

O usuário pode:

1. **Exportar backup** — a aplicação gera um arquivo `.txt` contendo a base atual em formato JSON.
2. **Importar backup** — um arquivo de backup pode ser selecionado para restaurar a base no navegador.

Dessa forma, o código da aplicação e os dados utilizados durante a operação permanecem separados.

## 💻 Tecnologias

- HTML5
- CSS3
- JavaScript
- Web Storage API (`localStorage`)
- JSON para serialização dos backups

## 📁 Estrutura do projeto

```text
RBI-Controle-de-Clientes/
├── index.html
├── style.css
├── script.js
└── README.md
```

## ▶️ Como usar

1. Abra o `index.html` no navegador ou acesse a versão publicada.
2. Cadastre uma nova OS informando nome, contrato, telefone e status.
3. Utilize a busca para localizar rapidamente um registro.
4. Clique em **Editar** para alterar os dados ou o status de uma OS.
5. Durante a edição, utilize **Salvar alterações** para confirmar ou **Remover OS** para excluir definitivamente o registro.
6. Utilize **Exportar backup** periodicamente para manter uma cópia portátil da base.
7. Utilize **Importar backup** quando precisar restaurar uma base salva anteriormente.

## 🧠 Como o projeto surgiu

Este projeto não começou como um exercício de CRUD.

Ele surgiu da observação de um problema durante um trabalho real.

O fluxo da operação envolve mais etapas do que simplesmente receber e finalizar uma ordem de serviço. Entre esses dois pontos existem contatos, respostas, tentativas sem retorno, agendamentos e coletas. Conforme passei a lidar com vários clientes ao mesmo tempo, percebi a necessidade de ter uma visão operacional própria dessas informações.

A primeira solução foi organizar manualmente dados como nome, contrato, telefone e situação do contato. Essa necessidade serviu como modelo para a aplicação.

O desenvolvimento seguiu uma lógica simples:

```text
problema real
    ↓
entender o fluxo
    ↓
identificar a informação necessária
    ↓
criar uma solução pequena
    ↓
usar na operação
    ↓
encontrar novas necessidades
    ↓
evoluir a ferramenta
```

O próprio sistema de backup surgiu dessa forma. Ao utilizar a aplicação localmente, apareceu a necessidade de transportar e proteger a base sem criar um banco de dados online. A solução foi permitir a exportação e importação dos registros por arquivo.

Assim, o projeto funciona também como um exemplo de desenvolvimento incremental: as funcionalidades são adicionadas a partir de problemas observados no uso real, e não apenas para aumentar a quantidade de recursos da aplicação.

## 🔒 Privacidade dos dados

Este repositório contém somente o código da aplicação.

Nenhuma informação real de clientes, contratos, telefones ou backups utilizados durante a operação faz parte do repositório.

A aplicação não envia a base local para o GitHub nem utiliza um banco de dados remoto próprio.

---

Projeto desenvolvido como aplicação prática de programação para apoiar uma necessidade real de trabalho.
