# 🟩 Lista de Etapas

Este documento fornece um guia passo a passo para rodar o projeto em sua máquina.

## 1. Pré-requisitos

Antes de começar, certifique-se de que você tenha os seguintes pré-requisitos instalados:
- Android Studio
- VScode (opcional, porém mais otimizado)
- Node
- Pnpm (verifique se você possui o pnpm no terminal com o comando ```pnpm -v```, se não tiver, instale-o com o comando ```npm install -g pnpm```)

## 2. Configuração do Ambiente

 1. #### **Clone o Repositório e instale as dependências**
   ```bash
   git clone https://github.com/FATEC-FULLSTACK/FRONTEND-API5S.git
   cd client
   pnpm install
```

2. #### **Abra o projeto no Android Studio** 
     I - No canto superior direito você deve achar a aba **device manager** <br>
     II -  Adicione um virtual device no icon + após clicar no lugar indicado pela seta <br>
     III -  Selecione Medium Screen API 35 e Adicione-o <br>
     IV - Clique no icon para rodar o Virtual Device <br> 



   ![tutorial1](https://github.com/user-attachments/assets/df94a782-428c-4544-892d-b76ffb901aba)

3. #### **Agora voce pode continuar no vscode**
   I -  Abra o projeto no Vscode <br>
   II - Entre na pasta client <br>
   III - Utilize o comando ```pnpm start``` com o **Virtual Device já inicializado no Android Studio**, dessa forma o expo reconhece o Device que está rodando em sua máquina. <br>
   IV - Em caso de dúvida sobre os comandos para executar o projeto, é só verificar a pasta package.json

## 3. Configuração do Emulador para Janela Separada

Para permitir que o Virtual Device seja exibido em uma janela separada, em vez de ficar fixado dentro do Android Studio, siga os passos abaixo:

1. **Abra as Configurações do Android Studio**
   - No Android Studio, vá para **"File"** > **"Settings"** (ou **"Preferences"** no macOS).

2. **Acesse as Configurações do Emulador**
   - No menu de configurações, navegue até **"Emulator"**

3. **Ajuste as Opções de Janela do Emulador**
   - Desmarque a opção **"Launch in the running devices tool window"**.
   - Marque a opção **"Open the running devices tool window when launching an app"**.

   Essas configurações garantirão que o emulador seja exibido em uma janela separada, permitindo que você visualize o Virtual Device fora do Android Studio.

Com essas configurações, o emulador abrirá em uma janela independente e você poderá trabalhar com ele de forma mais flexível, sem estar restrito à interface do Android Studio.

   
