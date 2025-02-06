'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient, createUsersClient } from "../appwrite";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_REPRESENTATIVE_COLLECTION_ID: APPWRITE_REPRESENTATIVE_COLLECTION_ID,
} = process.env;

export const getRepresentatives = async () => {
  const _cookies = cookies();
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      APPWRITE_REPRESENTATIVE_COLLECTION_ID!,
    );

    const documents = parseStringify(user.documents);

    return documents.map((rep) => {
      const { $id, $databaseId, $collectionId, ...rest } = rep;
      return {
        id: $id,
        ...rest,
      };
    });
  } catch (error) {

  };
}

export const createRepresentative = async (payload) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.createDocument(
      DATABASE_ID!,
      APPWRITE_REPRESENTATIVE_COLLECTION_ID!,
      ID.unique(),
      payload,
    );

  } catch (error) {
    console.error(error);
  };
}

export const deleteRepresentative = async (documentId) => {
  try {
    const { database } = await createAdminClient();

    await database.deleteDocument(
      DATABASE_ID!,
      APPWRITE_REPRESENTATIVE_COLLECTION_ID!,
      documentId,
    );
  } catch (error) {
    console.error(error);
  }
}