import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getActiveCart } from "@/lib/db/carts";
import { clearCart } from "@/lib/db/cartItems";

export async function POST() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await getActiveCart(user.id);

    if (!cart) {
      return NextResponse.json({ ok: true });
    }

    await clearCart(cart.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/cart/clear failed:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}