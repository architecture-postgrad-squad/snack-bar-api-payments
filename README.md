# Snack Bar API - Payments Service

### Alunos

- Débora Silveira - RM353919
- Eduardo Petri - RM353438
- Fernanda - RM353224

### O que é o projeto?

O **Snack Bar API - Payments Service** é o microserviço responsável por gerenciar pagamentos na arquitetura do projeto Snack Bar. Ele utiliza a integração com a API do [Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs) para implementar pagamentos via **PIX QR Code**, além de gerenciar o status de pedidos.

Este serviço oferece os seguintes endpoints:

- **Criar pagamento**: Cria um pagamento via PIX e atualiza o status do pedido relacionado para "WAITING_PAYMENT".
- **Buscar pagamento por ID**: Consulta os detalhes de um pagamento específico.
- **Atualizar pagamento por ID**: Atualiza o status de um pagamento e também atualiza o status do pedido relacionado para "RECEIVED" quando o pagamento é aprovado.

### Como iniciar localmente

A porta padrão do serviço é **3002**. Para executar o serviço localmente, siga os passos abaixo:

```bash
$ cd ${PROJECT_DIRECTORY}
$ docker-compose --env-file ./env/local.env up
```

## Como rodar os testes localmente

```bash
$ cd ${PROJECT_DIRECTORY}
$ npm i
$ npm run test
```
