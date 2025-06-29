import { supabase } from "./supabase";

export const uploadReceipt = async (file: File, userId: string) => {
  const filename = `${userId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("receipts")
    .upload(filename, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from("receipts")
    .getPublicUrl(filename);

  return publicUrl.publicUrl;
};
