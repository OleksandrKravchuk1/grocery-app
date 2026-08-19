import { supabase } from "@/src/lib/supabase";

export async function fetchPaymentSheetParams(amount: number) {
  const { data, error } = await supabase.functions.invoke("payment-sheet", {
    body: { amount },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
