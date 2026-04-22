import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getActiveCart, createCart } from "@/lib/db/carts";
import { getCartItem, upsertCartItem } from "@/lib/db/cartItems";
import { getItemById, findOrCreateItem } from "@/lib/db/items";

type AddRecipeIngredientInput = {
  name: string;
  measure: string;
  itemId?: string;
};

type AddRecipeBody = {
  recipeId: string;
  recipeName: string;
  ingredients: AddRecipeIngredientInput[];
};

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as AddRecipeBody;

    if (
      !body ||
      typeof body.recipeId !== "string" ||
      typeof body.recipeName !== "string" ||
      !Array.isArray(body.ingredients)
    ) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    let cart = await getActiveCart(user.id);

    if (!cart) {
      cart = await createCart(user.id);
    }

    for (const ingredient of body.ingredients) {
      if (!ingredient || typeof ingredient.name !== "string") {
        continue;
      }

      const measure = ingredient.measure?.trim() || "To taste";

      let resolvedItemId: string | null = null;

      if (ingredient.itemId) {
        const existingItem = await getItemById(ingredient.itemId);
        resolvedItemId = existingItem?.id ?? null;
      }

      if (!resolvedItemId) {
        const item = await findOrCreateItem(ingredient.name);
        resolvedItemId = item.id;
      }

      const existingCartItem = await getCartItem(
        cart.id,
        resolvedItemId,
        measure
      );

      const nextQuantity = existingCartItem
        ? existingCartItem.quantity + 1
        : 1;

      await upsertCartItem(cart.id, resolvedItemId, measure, nextQuantity);
    }

    return NextResponse.json({ ok: true, cartId: cart.id });
  } catch (error) {
    console.error("POST /api/cart/recipe failed:", error);
    return NextResponse.json(
      { error: "Failed to add recipe to cart" },
      { status: 500 }
    );
  }
}