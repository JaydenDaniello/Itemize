import { NextResponse } from "next/server";
import { getCheapestStoreForRecipe } from "@/lib/getCheapestStoreForRecipe";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getCheapestStoreForRecipe(id);
  return NextResponse.json(result);
}
