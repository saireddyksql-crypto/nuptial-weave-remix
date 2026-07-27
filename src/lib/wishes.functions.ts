import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

export type Wish = {
  id: string;
  name: string;
  relationship: string | null;
  message: string;
  created_at: string;
};

export const getWishes = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabase
    .from("wishes" as any)
    .select("id, name, relationship, message, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as unknown as Wish[];
});
