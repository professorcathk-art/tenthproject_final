import { createServiceClient } from "@/lib/supabase/server";

export function createAdminClient() {
  return createServiceClient();
}
