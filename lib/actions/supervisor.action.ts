'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient, createUsersClient } from "../appwrite";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_SUPERVISOR_COLLECTION_ID: APPWRITE_SUPERVISOR_COLLECTION_ID,
} = process.env;

export const getSupervisors = async () => {
  const _cookies = cookies();
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      APPWRITE_SUPERVISOR_COLLECTION_ID!,
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

export const createSupervisor = async (payload) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.createDocument(
      DATABASE_ID!,
      APPWRITE_SUPERVISOR_COLLECTION_ID!,
      ID.unique(),
      payload,
    );

  } catch (error) {
    console.error(error);
  };
}

export const deleteSupervisor = async (documentId) => {
  try {
    const { database } = await createAdminClient();

    await database.deleteDocument(
      DATABASE_ID!,
      APPWRITE_SUPERVISOR_COLLECTION_ID!,
      documentId,
    );
  } catch (error) {
    console.error(error);
  }
}

export const updateSupervisor = async (supervisorId, payload) => {
  try {
    const { database } = await createAdminClient();

    // Encontrando o documento pelo supervisorId
    const supervisors = await database.listDocuments(
      DATABASE_ID!,
      APPWRITE_SUPERVISOR_COLLECTION_ID!,
      [Query.equal("supervisorId", supervisorId)]
    );

    if (supervisors.documents.length === 0) {
      throw new Error(`Supervisor com ID ${supervisorId} não encontrado.`);
    }

    console.log(payload);

    const documentId = supervisors.documents[0].$id; // Pegando o ID do documento correspondente

    // Atualizando o supervisor encontrado
    const updatedSupervisor = await database.updateDocument(
      DATABASE_ID!,
      APPWRITE_SUPERVISOR_COLLECTION_ID!,
      documentId,
      { goal: payload },
    );


    return updatedSupervisor;
  } catch (error) {
    console.error("Erro ao atualizar o supervisor:", error);
  }
};

