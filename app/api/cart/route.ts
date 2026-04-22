import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getActiveCart, createCart } from "@/lib/db/carts";
import { getItemsForCart } from "@/lib/db/cartItems";
import { getItemsByIds } from "@/lib/db/items";

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let cart = await getActiveCart(user.id);

    if (!cart) {
      cart = await createCart(user.id);
    }

    const cartItems = await getItemsForCart(cart.id);
    const itemIds = [...new Set(cartItems.map((item) => item.itemId))];
    const items = await getItemsByIds(itemIds);

    const itemMap = new Map(items.map((item) => [item.id, item]));

    return NextResponse.json({
      cart: {
        id: cart.id,
        ownerId: cart.ownerId,
        storeId: cart.storeId,
        status: cart.status,
      },
      items: cartItems.map((cartItem) => {
        const item = itemMap.get(cartItem.itemId);

        return {
          id: cartItem.id,
          itemId: cartItem.itemId,
          name: item?.name ?? "Unknown item",
          quantity: cartItem.quantity,
          unit: cartItem.unit,
        };
      }),
    });
  } catch (error) {
    console.error("GET /api/cart failed:", error);
    return NextResponse.json(
      { error: "Failed to load cart" },
      { status: 500 }
    );
  }
}