import { uploadFile } from "../services/pdfService";

/**
 * ViewModel class that encapsulates business logic and state management for PDF workflows.
 */
export class PdfViewModel {
  /**
   * Orchestrates the PDF upload process and safely handles potential exceptions.
   * @param {File} file - The file to be uploaded.
   * @returns {Promise<{path: string, url: string, fileName: string}|null>}
   */
  async upload(file) {
    try {
      // 1. Validate file existence before making network requests
      if (!file) {
        throw new Error("No file provided for upload.");
      }

      // 2. Delegate the heavy lifting to the service layer
      const result = await uploadFile(file);
      
      // 3. Pass the structured result back to the View component
      return result;
    } catch (error) {
      // 4. Centralized error handling for the UI flow
      console.error("An error occurred during upload inside PdfViewModel:", error.message);
      
      // 5. Re-throw the error so the React View component knows the upload failed and can notify the user
      throw error;
    }
  }
}