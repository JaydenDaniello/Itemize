import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { lookupMeal } from "@/lib/themealdb";
import { normalizeIngredient } from "@/lib/ingredient/normalize";
import { matchIngredientBackend } from "@/lib/ingredient/matchBackend";

// Parse TheMealDB measure strings into { quantity: number | null, unit: string | null }
function parseMeasure(measure: string | null) {
  if (!measure) return { quantity: null, unit: null };

  const trimmed = measure.trim();
  if (!trimmed) return { quantity: null, unit: null };

  const parts = trimmed.split(" ");

  // Try parsing the first token as a number
  const qty = parseFloat(parts[0]);

  if (isNaN(qty)) {
    // Not a number → treat entire measure as unit
    return { quantity: null, unit: trimmed };
  }

  // Quantity is valid → unit is everything after the number
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
    // Fetch full recipe details from TheMealDB
    const meal = await lookupMeal(id);

    if (!meal) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Upsert the Recipe
    const recipe = await prisma.recipe.upsert({
      where: { externalId: id },
      update: {
        // For refreshing data
      },
      create: {
        externalId: id,
        title: meal.strMeal,
        source: "themealdb",
        thumbnailUrl: meal.strMealThumb,
        instructions: meal.strInstructions,
      },
    });

    // Upsert each ingredient
    for (const ing of meal.ingredients) {
      const { quantity, unit } = parseMeasure(ing.measure);

      // Normalize the ingredient name
      const normalized = normalizeIngredient(ing.name);

      // Try backend match first
      let match = await matchIngredientBackend(ing.name);

      // If no match, auto-create the Item
      if (!match) {
        const newItem = await prisma.item.create({
          data: {
            id: normalized,
            name: ing.name,
            normalizedName: normalized,
          },
        });

        match = { itemId: newItem.id, name: newItem.name };
      }

      await prisma.recipeIngredient.upsert({
        where: {
          recipeId_rawName: {
            recipeId: recipe.id,
            rawName: ing.name,
          },
        },
        update: {
          quantity,
          unit,
          itemId: match.itemId,
        },
        create: {
          recipeId: recipe.id,
          rawName: ing.name,
          quantity,
          unit,
          itemId: match.itemId,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Ingestion error:", err);
    return NextResponse.json({ error: "Failed to ingest recipe" }, { status: 500 });
  }
}
