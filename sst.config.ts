/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "agentcard",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    // Auth
    const auth = new sst.aws.CognitoUserPool("UserPool", {
      usernames: ["email"],
    });
    const authClient = auth.addClient("WebClient");

    // Storage
    const assetsBucket = new sst.aws.Bucket("AssetsBucket");

    // Database
    const cardsTable = new sst.aws.Dynamo("CardsTable", {
      fields: {
        pk: "string",
        sk: "string",
        gsi1pk: "string",
        gsi1sk: "string",
      },
      primaryIndex: { hashKey: "pk", rangeKey: "sk" },
      globalIndexes: {
        gsi1: { hashKey: "gsi1pk", rangeKey: "gsi1sk" },
      },
    });

    // API
    const api = new sst.aws.ApiGatewayV2("Api", {
      cors: {
        allowOrigins: ["*"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
      },
    });

    const environment = {
      CARDS_TABLE: cardsTable.name,
      ASSETS_BUCKET: assetsBucket.name,
      USER_POOL_ID: auth.id,
      USER_POOL_CLIENT_ID: authClient.id,
    };

    // Routes
    api.route("GET /cards", {
      handler: "backend/functions/cards/list.handler",
      environment,
      link: [cardsTable, assetsBucket],
    });
    api.route("POST /cards", {
      handler: "backend/functions/cards/create.handler",
      environment,
      link: [cardsTable, assetsBucket],
    });
    api.route("PUT /cards/{id}", {
      handler: "backend/functions/cards/update.handler",
      environment,
      link: [cardsTable],
    });
    api.route("DELETE /cards/{id}", {
      handler: "backend/functions/cards/delete.handler",
      environment,
      link: [cardsTable],
    });

    api.route("POST /exchange/p2p", {
      handler: "backend/functions/exchange/p2p.handler",
      environment,
      link: [cardsTable],
    });
    api.route("POST /sessions", {
      handler: "backend/functions/sessions/create.handler",
      environment,
      link: [cardsTable],
    });
    api.route("POST /sessions/{id}/join", {
      handler: "backend/functions/sessions/join.handler",
      environment,
      link: [cardsTable],
    });
    api.route("GET /sessions/{id}/cards", {
      handler: "backend/functions/sessions/cards.handler",
      environment,
      link: [cardsTable],
    });
    api.route("POST /sessions/{id}/keep", {
      handler: "backend/functions/sessions/keep.handler",
      environment,
      link: [cardsTable],
    });

    return {
      ApiUrl: api.url,
      UserPoolId: auth.id,
      UserPoolClientId: authClient.id,
      AssetsBucket: assetsBucket.name,
    };
  },
});
