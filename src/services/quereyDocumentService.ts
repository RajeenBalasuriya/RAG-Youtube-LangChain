import { Request } from "express";
import { createSupabaseClient } from "../helpers/superbaseClientHelpers";
import { Cohere, CohereEmbeddings } from "@langchain/cohere";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

export class QueryDocumentService {
  async storeDocument(req: Request) {
    try {
      const { conversationId, query,documentIds } = req.body;

      // Init Supabase client
      const supabase = createSupabaseClient();

      //store user query in the database
      await supabase.from("conversation_messages").insert({
        conversation_id: conversationId,
        role: "user",
        content: query,
      });

      //grab the  conversation history
      const previousMessages = await supabase
        .from("conversation_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false })
        .limit(14);

      const embeddings = new CohereEmbeddings({
        apiKey: process.env.COHERE_API_KEY,
        model: "embed-english-v3.0", // Or embed-multilingual-v3.0
      });

      // Step 2: Use Cohere's chat model
const cohereLLM = new Cohere({
  apiKey: process.env.COHERE_API_KEY,
  model: "command-r", // or "command-r", or other Cohere chat models
  temperature: 0.3,
});


  const vectorStore = new SupabaseVectorStore(embeddings, {
        client: supabase,
        tableName: "embedded_documents", // Ensure this table exists in your Supabase database
        queryName: "match_documents",
        filter:{
            document_ids:documentIds
        }
      });





    } catch (error) {
      console.error("Error storing document:", error);
      throw new Error("Failed to store document");
    }
  }
}
