# NIGHTFALL — Escape (protótipo multiplayer)

Jogo original de perseguição/sobrevivência 3D inspirado no gênero de Evade. Não usa assets, mapas ou personagens oficiais do Roblox/Evade.

## Rodar no computador
1. Instale Node.js 18 ou mais recente.
2. Extraia o ZIP.
3. Abra um terminal dentro da pasta e execute:
   ```bash
   npm install
   npm start
   ```
4. Abra `http://localhost:3000`.

## Jogar com seu amigo pela internet
O jogo precisa ficar hospedado em um serviço que rode Node.js e aceite WebSocket (por exemplo, Render, Railway ou VPS).
- Faça upload desta pasta para um repositório Git.
- Crie um serviço Web Service Node no host, com comando de build `npm install` e start `npm start`.
- Abra a URL HTTPS que o host fornecer.
- Você e seu amigo abrem a mesma URL, digitam o mesmo código de sala (por exemplo `AMIGOS`) e entram.

## Controles
- PC: WASD para mover, mouse para olhar, Espaço para pular, Shift para correr, Ctrl para deslizar.
- Celular: analógico esquerdo, arrastar lado direito para olhar, botões correr/pular/deslizar/reviver.

## Estado do protótipo / limitações
- A conexão WebSocket sincroniza jogadores, apelidos, posição, vida e estado caído por sala.
- O inimigo perseguidor e a lógica de dano ainda são simulados localmente em cada cliente; não é um servidor autoritativo competitivo.
- Reviver é um protótipo de interação e ainda precisa de validação de distância/estado no servidor para produção.
- Este é um primeiro protótipo jogável, não um clone completo nem um jogo final. Próximas melhorias recomendadas: IA do inimigo no servidor, sistema de objetivos/saída, mais mapas, animações, áudio espacial, colisões detalhadas e proteção contra trapaças.
