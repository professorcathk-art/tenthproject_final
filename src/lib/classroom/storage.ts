import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const CLASSROOM_BUCKET = "classroom";

export async function createClassroomUploadUrl(path: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase Storage is not configured");
  }
  const { data, error } = await createServiceClient()
    .storage.from(CLASSROOM_BUCKET)
    .createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message || "Could not create upload URL");
  return data;
}

export async function createClassroomSignedUrl(path: string, download = false, expiresIn = 60 * 60) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase Storage is not configured");
  }
  const { data, error } = await createServiceClient()
    .storage.from(CLASSROOM_BUCKET)
    .createSignedUrl(path, expiresIn, download ? { download: true } : undefined);
  if (error || !data?.signedUrl) throw new Error(error?.message || "Could not sign file URL");
  return data.signedUrl;
}
