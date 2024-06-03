import { useQuery } from "@realm/react";
import Realm, { BSON } from "realm";
import Chat from "../models/Chat";

function addChat(
  realm: Realm,
  chatData: {
    title: string;
    messages: any;
  }
) {
  const id = new BSON.ObjectId();
  realm.write(() => {
    realm.create("Chat", {
      _id: id,
      title: chatData.title,
      messages: JSON.stringify(chatData.messages),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
  return id;
}

function updateChat(
  realm: Realm,
  chatId: BSON.ObjectId,
  chatData: {
    title: string;
    messages: any;
  }
) {
  realm.write(() => {
    let chat = realm.objectForPrimaryKey("Chat", chatId);
    if (chat) {
      chat.title = chatData.title;
      chat.messages = JSON.stringify(chatData.messages);
      chat.updatedAt = new Date();
    }
  });
}

function useChats(realm: Realm): Realm.Results<Chat> {
  const chats = useQuery(Chat);
  return chats;
}

function useChat(realm: Realm, chatId: BSON.ObjectId) {
  const chat = realm.objectForPrimaryKey("Chat", chatId);
  return chat;
}

export { addChat, updateChat, useChat, useChats };

