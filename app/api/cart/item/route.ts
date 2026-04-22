import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getActiveCart } from "@/lib/db/carts";
import {
  getCartItem,
  upsertCartItem,
  removeCartItem,
} from "@/lib/db/cartItems";
import { findOrCreateItem } from "@/lib/db/items";

type UpdateCartItemBody = {
  name: string;
  quantity: number;
  measure: string;
};

type DeleteCartItemBody = {
  name: string;
  measure: string;
};

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await getActiveCart(user.id);

    if (!cart) {
      return NextResponse.json({ error: "Active cart not found" }, { status: 404 });
    }

    const body = (await req.json()) as UpdateCartItemBody;

    if (
      !body ||
      typeof body.name !== "string" ||
      typeof body.measure !== "string" ||
      typeof body.quantity !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const quantity = Number.isFinite(body.quantity)
      ? Math.max(1, Math.round(body.quantity))
      : 1;

    const measure = body.measure.trim() || "To taste";
    const item = await findOrCreateItem(body.name);
    const updated = await upsertCartItem(cart.id, item.id, measure, quantity);

    return NextResponse.json({
      ok: true,
      item: {
        id: updated.id,
        cartId: updated.cartId,
        itemId: updated.itemId,
        quantity: updated.quantity,
        unit: updated.unit,
      },
    });
  } catch (error) {
    console.error("PATCH /api/cart/item failed:", error);
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await getActiveCart(user.id);

    if (!cart) {
      return NextResponse.json({ error: "Active cart not found" }, { status: 404 });
    }

    const body = (await req.json()) as DeleteCartItemBody;

    if (
      !body ||
      typeof body.name !== "string" ||
      typeof body.measure !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const measure = body.measure.trim() || "To taste";
    const item = await findOrCreateItem(body.name);
    const cartItem = await getCartItem(cart.id, item.id, measure);

    if (!cartItem) {
      return NextResponse.json({ ok: true });
    }

    await removeCartItem(cartItem.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/cart/item failed:", error);
    return NextResponse.json(
      { error: "Failed to remove cart item" },
      { status: 500 }
    );
  }
}
