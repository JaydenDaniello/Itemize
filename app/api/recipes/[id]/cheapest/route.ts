import { NextResponse } from "next/server";
import { getCheapestStoreForRecipe } from "@/lib/getCheapestStoreForRecipe";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const result = await getCheapestStoreForRecipe(params.id);
  return NextResponse.json(result);
}
