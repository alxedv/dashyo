'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient, createUsersClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_SUPERVISOR_COLLECTION_ID: APPWRITE_SUPERVISOR_COLLECTION_ID,
} = process.env;


export async function checkUserExists(email: string) {
  console.log("Appwrite Endpoint:", process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);

  const usersClient = await createUsersClient();

  try {
    const usersList = await usersClient.list();
    const user = usersList.users.find(user => user.email === email);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}


export const requestPasswordReset = async (email: string) => {
  try {
    const { account } = await createAdminClient();

    await checkUserExists(email);
    console.log({ email });


    await account.createRecovery(
      email,
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`
    );

    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { message: "Erro ao solicitar recuperação de senha. Tente novamente mais tarde.", error: error.message };
  }
};

export const resetPassword = async (userId: string, secret: string, newPassword: string) => {
  try {
    const { account } = await createAdminClient();
    await account.updateRecovery(userId, secret, newPassword);

    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Erro ao redefinir senha.");
  }
};



export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const _cookies = cookies();
    const { database } = await createAdminClient();
    const users = await createUsersClient();

    const userInfo = await users.get(userId);

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    );

    return parseStringify({ ...userInfo, role: user.documents[0].role, companyName: user.documents[0].companyName });
  } catch (error) {

  }
}

export const listUsers = async () => {
  const users = await createUsersClient();
  const _cookies = cookies();

  let result = await users.list();

  return parseStringify(result);
}

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();
    const users = await createUsersClient();

    const session = await account.createEmailPasswordSession(email, password);
    const userInfo = await users.get(session.userId);

    if (userInfo.emailVerification) {
      cookies().set("appwrite-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });

      cookies().set("appwrite-user-id", session.userId, {
        path: "/",
        httpOnly: false,
        sameSite: "strict",
        secure: true,
      });
    }

    return getUserInfo({ userId: session.userId });

  } catch (error: any) {
    console.error("Erro ao fazer login:", error);

    if (error.code === 401) {
      throw new Error("Email ou senha incorretos.");
    } else if (error.code === 403) {
      throw new Error("Acesso negado. Verifique se sua conta foi ativada.");
    } else if (error.code === 429) {
      throw new Error("Muitas tentativas. Aguarde um momento antes de tentar novamente.");
    } else {
      throw new Error("Erro inesperado. Tente novamente mais tarde.");
    }
  }
};



export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, name, companyName, role } = userData;
  let newUserAccount;

  try {
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      name,
    );

    if (!newUserAccount) throw new Error('Error creating user');

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        role: role !== "admin" ? "default" : "admin",
        companyName,
      }
    );

    await database.createDocument(
      DATABASE_ID!,
      APPWRITE_SUPERVISOR_COLLECTION_ID!,
      ID.unique(),
      {
        name: userData.name,
        supervisorId: newUserAccount.$id,
      }
    );


    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);

  } catch (error) {
    console.error(error);
  }
}

export const loggoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    cookies().delete('appwrite-session');
    cookies().delete('appwrite-user-id');

    await account.deleteSession('current');
  } catch (error) {
    return null;
  }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({
      userId: result.$id
    })
    return parseStringify(user);
  } catch (error) {
    return null;
  }
}

export async function updateAccountStatus(userId: string, value: boolean) {

  const users = await createUsersClient();

  users.updateEmailVerification(userId, value)
    .then(response => {
      console.log({ response });
    })
    .catch(error => {
      console.error(error);
    });
}
