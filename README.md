<div align="center">
  <h1>INVESTIUM</h1>
</div>

<br>

<h3 align="center">Um sistema criado para facilitar e incentivar o investimento em IPO </h3>

<p align="center">
  <a href="#-por-quê">Por quê?</a> •
  <a href="#-demonstracao">Demonstração</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-como-usar">Rodando o projeto local</a>
</p>

<br><br>

<h2>🧐 Por quê?</h2>
<p>O mercado de IPOs é repleto de desafios. Por isso, a <strong>FIAP em parceria com a B3</strong> nos desafiou a usar a tecnologia para desmistificar os investimentos em IPO no Brasil. 
  A partir disso tentamos entender: O que impede as pessoas de investirem em IPO?</p>
<p>Os principais problemas encontrados foram:</p>
<ul>
  <li>Burocracia ao encontrar dados da empresa com IPO em andamento</li>
  <li>Dificuldade para entender as informações das ofertas</li>
  <li>Risco de investimento</li>
</ul>
<p>Pensando nisso, a <strong>Investium</strong> foi criada! Com diversas funcionalidades, como: </p>
<ul>
  <li>Listagem das empresas com IPO em andamento ou finalizado</li>
  <li>Desde dados financeiros até governança das empresas</li>
  <li>Diversos artigos sobre educação financeira e investimento</li>
  <li>Comparação de IPOs para uma decisão mais embasada</li>
  <li>Chatbot intuitivo: O chatbot torna a busca por artigos e termos no nosso site muito mais fácil e otimizada.</li>
</ul>

<br>

<h2>💻 Demonstração</h2>

https://github.com/mariana-santos/repo_challenge/assets/56116824/f36eff07-1c37-4443-ac01-563c75fd1e30
<p>Assista no Youtube: https://youtu.be/3nP4r-L_qqk</p>
<p>Teste a versão Beta da aplicação: https://repo-challenge-j1bp-rcxn1h15r-mariana-santos.vercel.app/</p>

<h2>🛠 Tecnologias</h2>
As seguintes ferramentas foram usadas na construção do projeto:

### 👉 **_Backend_**

- Java (API criada com Jersey)
- Oracle Database
- Heroku para hospedagem da API

### 👉 **Web**

- React
- Javascript
- React Query

### 👉 **_Desenvolvimento Geral_**

- Editor:
  - Visual Studio Code
  - Eclipse
- Prototipagem:
  - Figma
- Diagramas:
  - Astah

<br>

<h2>🚀 Rodando o projeto local</h2>

Antes de tudo, você precisa ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/), [Eclipse (Java)](https://www.oracle.com/java/technologies/downloads/) e [JDBC](https://www.oracle.com/database/technologies/appdev/jdbc-downloads.html). 
Além disso, é bom ter um editor para trabalhar com o código, como [VSCode](https://code.visualstudio.com/).

O projeto é divido em três partes:

- 🎲 Backend
- 💻 Web

```bash
# Clone o repositório
$ git clone https://github.com/mariana-santos/repo_challenge.git
```

##### 👉 **_Backend:_**

```bash
$ cd InvestiumAPI
```

Adicionando o Driver no seu projeto no Eclipse:

_Botão direito no projeto > Properties > Java Build Path > clique em Modulepath > Add External JARs… > Escolha o driver JDBC que você fez download anteriormente > Apply and Close_

Rode o servidor:

_Para rodar, encontre o arquivo Launcher.java (/InvestiumAPI/src/main/java/br/com/fiap/main/Launcher.java) e pressione o botão de *PLAY* do Eclipse_


##### 👉 **_Website:_**

```bash
# Para instalar as dependências:
$ cd ..
$ cd FRONT/devzilla_react
$ npm install
```

Rode o website:

```bash
$ npm start
```

<br><br>
