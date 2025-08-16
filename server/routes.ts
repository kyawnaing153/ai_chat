import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Import the OpenAI library to interface with the DeepSeek API
import { OpenAI } from "openai";

export async function registerRoutes(app: Express): Promise<Server> {

  const httpServer = createServer(app);

  return httpServer;
}
