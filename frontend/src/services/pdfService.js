import { supabase } from "../config/supabase";

/**
 * Service function to handle direct interaction with Supabase Storage.
 * @param {File} file - The raw file object obtained from the input element.
 * @returns {Promise<{path: string, url: string, fileName: string}>} - Upload metadata.
 */
export async function uploadFile(file) {
  // 1. Create a unique file path inside the bucket to prevent overwriting existing files
  const filePath = `law-sources/${Date.now()}-${file.name}`;

  // 2. Upload the file binary data to the 'contracts' storage bucket
  const { data, error } = await supabase.storage
    .from("contracts")
    .upload(filePath, file);

  // 3. If Supabase returns an error, intercept it and throw it to the caller
  if (error) throw error;

  // 4. Retrieve the public, unauthenticated URL for the uploaded file
  // Note: This requires the 'contracts' bucket privacy setting to be set to "Public"
  const { data: urlData } = supabase.storage
    .from("contracts")
    .getPublicUrl(filePath);

  // 5. Return a clean data object to the upper layers (ViewModel/View)
  return {
    path: data.path,
    url: urlData.publicUrl,
    fileName: file.name
  };
}