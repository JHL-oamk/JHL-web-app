import { createQuery } from "../queryService";
import { createResult } from "../resultService";

//Mocks the AI chatbot the test dataflow with firestore
export const mockQueryFlow = async (uid, question) => {
  try {
    // 1. CREATE QUERY (Firestore)
    const queryRef = await createQuery(uid, question);
    console.log("🔥 QUERY CREATED:", queryRef.id);

    // 2. FAKE AI RESPONSE
    const fakeAnswer = `This is a mock AI answer for: "${question}"`;

    // 3. CREATE RESULT (Firestore)
    const resultRef = await createResult(queryRef.id, fakeAnswer, [
      {
        title: "Mock source",
        url: "https://example.com"
      }
    ]);

    console.log("📦 RESULT CREATED:", resultRef.id);

    return {
      queryId: queryRef.id,
      resultId: resultRef.id
    };

  } catch (error) {
    console.error("❌ MOCK FLOW ERROR:", error);
    throw error;
  }
};