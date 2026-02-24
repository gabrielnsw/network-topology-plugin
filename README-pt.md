# Network Topology (Português)

[![Donate with PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/donate?business=Z9USFAAMBJ29S&no_recurring=0&item_name=Developing+the+Network+Topology+plugin+for+Grafana+to+solve+real+monitoring+issues.+Help+me+keep+the+project+evolving!&currency_code=USD)

_(🌎 Read this document in English [here](README.md))_

## Introdução

O **Network Topology** é um plugin de painel para Grafana construído para exibir mapas de rede interativos utilizando o Cytoscape.js integrado nativamente às respostas do próprio Grafana.

Em vez de depender de servidores externos ou APIs intermediárias, esse painel aproveita os dados brutos (DataFrames) que o Grafana puxa do plugin do Zabbix oficial. Isso permite visualizar com precisão e tempo real o tráfego das suas interfaces, perdas de pacote, latência e o status (UP/DOWN) direto em cima dos seus equipamentos desenhados.

**Funcionalidades principais:**

- **Editor visual interativo:** Adicione roteadores, switches, servidores, antenas e personalize ligações e tamanhos através do arrastar e soltar do próprio painel.
- **Integração total com Zabbix:** Trabalha capturando o histórico e as métricas diretamente das consultas configuradas usando os IDs corretos.
- **Mapeamento flexível:** Permite que você abra a configuração de um host e escolha manualmente na lista de itens monitorados qual chave usar para o cálculo de ping, latência e perda (loss).
- **Inspeção de links dinâmica:** As arestas mudam de cor conforme o tráfego medido, identificando rapidamente gargalos e problemas.
- **Backup local integrado:** Ferramentas nativas para que a sua topologia inteira e customizações de tema sejam exportadas em JSON ou restauradas de forma portátil.
- **Tradução nativa:** Interface interna com suporte ao idioma inglês, português e espanhol.

## Requisitos

- **Grafana** versão 10.0 ou superior.
- **Plugin Zabbix para Grafana** (Alexander Zobnin) instalado e configurado como Data Source.

## Guia de instalação e uso

1. Copie o diretório finalizado de build para os volumes do seu `/var/lib/grafana/plugins/` (ou onde armazena seus plugins de costume) e reinicie o seu Grafana.
2. Adicione o painel **Network Topology** em um dashboard.
3. Use o DataSource do Zabbix na aba Query para trazer os itens utilizando o modo de consulta: **Metrics**.
4. Desenhe e salve suas estruturas usando os menus interativos do próprio painel. Toda a topologia é salva automaticamente em JSON no painel do Grafana.

## Contribuição

Feedbacks e contribuições são muito bem vindos!
Se você encontrou algum bug ou quer propor novos recursos, fique à vontade para abrir uma issue ou criar um pull request no nosso repositório do Github.
