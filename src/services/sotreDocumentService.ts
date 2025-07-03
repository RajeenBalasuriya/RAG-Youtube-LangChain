import { Request } from "express";
import { createSupabaseClient } from "../helpers/superbaseClientHelpers";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { CohereEmbeddings } from "@langchain/cohere"; // ✅ use Cohere
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export class StoreDocumentService {
  async storeDocument(req: Request) {
    try {
      const { url, documentId } = req.body;
      console.log("Received URL:", url);

      // Init Supabase client
      const supabase = createSupabaseClient();

      // ✅ Initialize Cohere embeddings
      const embeddings = new CohereEmbeddings({
        apiKey: process.env.COHERE_API_KEY,
        model: "embed-english-v3.0", // Or embed-multilingual-v3.0
      });

      // Init Supabase vector store
      const vectorStore = new SupabaseVectorStore(embeddings, {
        client: supabase,
        tableName: "embedded_documents", // Ensure this table exists in your Supabase database
        queryName: "match_documents",
      });

      // Load YouTube transcript
      const loader = YoutubeLoader.createFromUrl(url, {
        addVideoInfo: true,
      });

      const docs = await loader.load();

      // Add metadata (title and content)
      docs[0].pageContent = `video title: ${docs[0].metadata.title} | Video context: ${docs[0].pageContent}`;

      // Split the document into chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const texts = await textSplitter.splitDocuments(docs);

      console.log(texts)

      // Add custom metadata to each chunk
      const docsWithMetadata = texts.map((text) => ({
        ...text,
        metadata: {
          ...text.metadata,
          documentId,
        },
      }));

      // Add to vector DB
      await vectorStore.addDocuments(docsWithMetadata);
    } catch (error) {
      console.error("Error storing document:", error);
      throw new Error("Failed to store document");
    }
  }
}
