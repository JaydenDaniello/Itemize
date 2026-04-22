import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { lookupMeal } from "@/lib/themealdb";
import { getCanonicalIngredientName } from "@/lib/normalizeIngredient";
import { matchIngredientBackend } from "@/lib/ingredient/matchBackend";

// Parse TheMealDB measure strings into { quantity: number | null, unit: string | null }
function parseMeasure(measure: string | null) {
  if (!measure) return { quantity: null, unit: null };

  const trimmed = measure.trim();
  if (!trimmed) return { quantity: null, unit: null };

  const parts = trimmed.split(" ");
  const qty = parseFloat(parts[0]);

  if (Number.isNaN(qty)) {
    return { quantity: null, unit: trimmed };
  }

  const unit = parts.slice(1).join(" ") || null;

  return { quantity: qty, unit };
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const meal = await lookupMeal(id);

    if (!meal) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const recipe = await prisma.recipe.upsert({
      where: { externalId: id },
      update: {
        title: meal.strMeal,
        source: "themealdb",
        thumbnailUrl: meal.strMealThumb,
        instructions: meal.strInstructions,
      },
      create: {
        externalId: id,
        title: meal.strMeal,
        source: "themealdb",
        thumbnailUrl: meal.strMealThumb,
        instructions: meal.strInstructions,
      },
    });

    for (const ingredient of meal.ingredients) {
      const { quantity, unit } = parseMeasure(ingredient.measure);
      const normalized = getCanonicalIngredientName(ingredient.name);

      let match = await matchIngredientBackend(ingredient.name);

      if (!match) {
        const newItem = await prisma.item.create({
          data: {
            id: normalized,
            name: ingredient.name,
            normalizedName: normalized,
          },
        });

        match = { itemId: newItem.id, name: newItem.name };
      }

      const existingIngredient = await prisma.recipeIngredient.findFirst({
        where: {
          recipeId: recipe.id,
          rawName: ingredient.name,
        },
        select: { id: true },
      });

      if (existingIngredient) {
        await prisma.recipeIngredient.update({
          where: { id: existingIngredient.id },
          data: {
            quantity,
            unit,
            itemId: match.itemId,
          },
        });
      } else {
        await prisma.recipeIngredient.create({
          data: {
            recipeId: recipe.id,
            rawName: ingredient.name,
            quantity,
            unit,
            itemId: match.itemId,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ingestion error:", error);
    return NextResponse.json(
      { error: "Failed to ingest recipe" },
      { status: 500 }
    );
  }
}
