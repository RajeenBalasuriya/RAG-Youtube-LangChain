import { Router } from "express";
import { QueryDocumentService } from "../services/quereyDocumentService";

const queryDocumentRoutes = Router();
const queryDocumentService = new QueryDocumentService();

queryDocumentRoutes.post("/", async (req, res) => {
    try {

    
        // Call the storeDocument method with the request
        await queryDocumentService.storeDocument(req);

        res.status(200).json({ message: "Document stored successfully" });

    }
    catch (error) {
        console.error("Error storing document:", error);
        res.status(500).json({ error: "Failed to store document" });
    }
});


export default queryDocumentRoutes;