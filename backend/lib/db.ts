import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  BatchGetCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";

export const TABLE = process.env.CARDS_TABLE!;

const client = new DynamoDBClient({});
export const db = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

export { GetCommand, PutCommand, QueryCommand, UpdateCommand, DeleteCommand, BatchGetCommand, TransactWriteCommand };

export const keys = {
  userCard: (userId: string, cardId: string) => ({
    pk: `USER#${userId}`,
    sk: `CARD#${cardId}`,
  }),
  cardGsi: (cardId: string) => ({
    gsi1pk: `CARD#${cardId}`,
    gsi1sk: `CARD#${cardId}`,
  }),
  exchange: (userId: string, exchangeId: string) => ({
    pk: `USER#${userId}`,
    sk: `EXCHANGE#${exchangeId}`,
  }),
  received: (userId: string, prefix: string) => ({
    pk: `USER#${userId}`,
    skPrefix: `RECEIVED#${prefix}`,
  }),
  session: (sessionId: string) => ({
    pk: `SESSION#${sessionId}`,
    sk: "META",
  }),
  sessionMember: (sessionId: string, userId: string) => ({
    pk: `SESSION#${sessionId}`,
    sk: `MEMBER#${userId}`,
  }),
};
