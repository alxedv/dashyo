'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient, createUsersClient } from "../appwrite";
import { parseStringify } from "../utils";
import axios from "axios";
import { cookies } from "next/headers";
import { getUserInfo } from "./user.actions";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_CUSTOMER_COLLECTION_ID: APPWRITE_CUSTOMER_COLLECTION_ID,
} = process.env;

export const getCustomers = async (userId) => {
  try {
    const { database } = await createAdminClient();
    let customers;

    const userInfo = await getUserInfo({ userId });

    if (userInfo.role === "admin") {
      customers = await database.listDocuments(
        DATABASE_ID!,
        APPWRITE_CUSTOMER_COLLECTION_ID!,
        [Query.limit(200)]
      );
    }

    if (userInfo.role === "default") {
      customers = await database.listDocuments(
        DATABASE_ID!,
        APPWRITE_CUSTOMER_COLLECTION_ID!,
        [
          Query.equal('supervisorId', [userId]),
          Query.limit(200)
        ]
      );
    }

    // Transformar os documentos obtidos
    const documents = parseStringify(customers.documents);

    return documents.map((customer) => {
      const { $id, $databaseId, $collectionId, ...rest } = customer;
      return {
        id: $id,
        ...rest,
        equipments: JSON.parse(rest.equipments),
      };
    });
  } catch (error) {
    console.error('Erro ao obter clientes:', error);
    return [];
  }
};



export const createCustomer = async (payload) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.createDocument(
      DATABASE_ID!,
      APPWRITE_CUSTOMER_COLLECTION_ID!,
      ID.unique(),
      payload,
    );
  } catch (error) {
    console.error(error);
  };
}

export const updateCustomer = async (payload) => {
  const { id, documentId, ...rest } = payload;
  try {
    const { database } = await createAdminClient();

    const user = await database.updateDocument(
      DATABASE_ID!,
      APPWRITE_CUSTOMER_COLLECTION_ID!,
      payload.documentId,
      {
        ...rest
      },
    );
  } catch (error) {
    console.error(error);
  };
}

export const deleteCustomer = async (documentId) => {
  try {
    const { database } = await createAdminClient();
    const DOCUMENT_ID = documentId;

    const user = await database.deleteDocument(
      DATABASE_ID!,
      APPWRITE_CUSTOMER_COLLECTION_ID!,
      documentId,
    );
  } catch (error) {
    console.error(error);
  }
}

export const getLocation = async (lat, lng) => {
  const result = await axios.get(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ptbr`
  );

  return {
    city: result.data.city,
    uf: result.data.principalSubdivision,
    country: result.data.countryName,
  };
};

export const updateCustomersSupervisor = async () => {
  try {
    const { database } = await createAdminClient();
    const oldSupervisorId = '66d61933000ef532e675';
    const newSupervisorId = '6717ee0f00109ce3ac93';

    // Obtendo todos os clientes com o supervisor antigo
    const customers = await database.listDocuments(
      DATABASE_ID!,
      APPWRITE_CUSTOMER_COLLECTION_ID!,
      [Query.equal('supervisorId', oldSupervisorId), Query.limit(200)]
    );

    const customerUpdates = customers.documents.map(async (customer) => {
      return await database.updateDocument(
        DATABASE_ID!,
        APPWRITE_CUSTOMER_COLLECTION_ID!,
        customer.$id,
        { supervisorId: newSupervisorId }
      );
    });

    // Aguarda todas as atualizações
    await Promise.all(customerUpdates);

    console.log('Clientes atualizados com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar clientes:', error);
  }
};

