import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { matchIngredientBackend } from "@/lib/ingredient/matchBackend";

export async function GET() {
  try {
    // Fetch all ingredients that do NOT have an itemId
    const ingredients = await prisma.recipeIngredient.findMany({
      where: { itemId: null },
    });

    let updatedCount = 0;

    for (const ing of ingredients) {
      const match = await matchIngredientBackend(ing.rawName);

      if (match?.itemId) {
        await prisma.recipeIngredient.update({
          where: { id: ing.id },
          data: { itemId: match.itemId },
        });

        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      updated: updatedCount,
      totalMissing: ingredients.length,
    });
  } catch (err) {
    console.error("Backfill error:", err);
    return NextResponse.json(
      { error: "Failed to backfill ingredients" },
      { status: 500 }
    );
  }
}
