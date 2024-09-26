// src/stores/chat.store.ts

import { defineStore } from 'pinia';
import { db } from '@/db';
import type { Chat, Message } from '@/models/chat.model';
import { getChatCompletion } from '@/services/openai.service';

export const useChatStore = defineStore('chat', {
  state: () => ({
    chats: [] as Chat[],
    currentChatId: null as number | null,
  }),
  actions: {
    async loadChats() {
      this.chats = await db.chats.toArray();
    },
    async createChat(title: string) {
      const newChat: Chat = {
        id: Date.now(),
        title,
        messages: [],
      };
      await db.chats.add(newChat);
      this.chats.push(newChat);
      this.currentChatId = newChat.id;
    },
    async addMessage(content: string) {
      const chat = this.getCurrentChat();
      if (!chat) {
        console.error('No chat selected');
        return;
      }

      // User message
      const userMessage: Message = {
        role: 'user',
        content,
      };
      chat.messages.push(userMessage);

      // Save the updated chat with the user's message
      await db.chats.put(chat);

      // Assistant's response
      try {
        // Call the OpenAI API via the backend service
        const response = await getChatCompletion(chat.messages);

        const assistantMessage: Message = {
          role: 'assistant',
          content: response.choices[0].message.content,
        };
        chat.messages.push(assistantMessage);

        // Save the updated chat with the assistant's reply
        await db.chats.put(chat);
      } catch (error) {
        console.error('Error fetching OpenAI response:', error);

        const errorMessage: Message = {
          role: 'assistant',
          content: 'Sorry, an error occurred while fetching the response.',
        };
        chat.messages.push(errorMessage);
        await db.chats.put(chat);
      }
    },
    getCurrentChat(): Chat | undefined {
      return this.chats.find((chat) => chat.id === this.currentChatId);
    },
    setCurrentChat(chatId: number) {
      this.currentChatId = chatId;
    },
    async deleteChat(chatId: number) {
      await db.chats.delete(chatId);
      this.chats = this.chats.filter((chat) => chat.id !== chatId);
      if (this.currentChatId === chatId) {
        this.currentChatId = this.chats.length > 0 ? this.chats[0].id : null;
      }
    },
    // Additional actions can be added here
  },
});
