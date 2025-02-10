'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient, createUsersClient } from "../appwrite";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_EQUIPMENTS_COLLECTION_ID: APPWRITE_EQUIPMENTS_COLLECTION_ID,
} = process.env;

export const getEquipments = async () => {
  const _cookies = cookies();
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      APPWRITE_EQUIPMENTS_COLLECTION_ID!,
    );

    const documents = parseStringify(user.documents);
    console.log({ documents });

    return documents.map((eqp) => {
      const { $id, $databaseId, $collectionId, ...rest } = eqp;
      return {
        id: $id,
        ...rest,
      };
    });
  } catch (error) {

  };
}

export const createEquipments = async (payload) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.createDocument(
      DATABASE_ID!,
      APPWRITE_EQUIPMENTS_COLLECTION_ID!,
      ID.unique(),
      payload,
    );

  } catch (error) {
    console.error(error);
  };
}
