import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDemoStoreName } from "@/lib/demoStores";

type ComparisonRequestItem = {
  itemId?: string;
  quantity?: number;
  name?: string;
};

type ValidComparisonItem = {
  itemId: string;
  quantity: number;
  name: string;
};

function hasItemId(item: ComparisonRequestItem): item is ComparisonRequestItem & {
  itemId: string;
} {
  return typeof item.itemId === "string" && item.itemId.trim().length > 0;
}

function formatAddress(store: {
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
}) {
  return [store.address, store.city, store.state, store.zip]
    .filter(Boolean)
    .join(", ");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const requestedItems: ValidComparisonItem[] = Array.isArray(body?.items)
      ? body.items
          .filter((item: ComparisonRequestItem): item is ComparisonRequestItem => !!item)
          .filter(hasItemId)
          .map((item: ComparisonRequestItem & { itemId: string }): ValidComparisonItem => ({
            itemId: item.itemId.trim(),
            quantity:
              typeof item.quantity === "number" && Number.isFinite(item.quantity)
                ? Math.max(1, item.quantity)
                : 1,
            name: typeof item.name === "string" ? item.name : "Unknown item",
          }))
      : [];

    const requestedStoreIds = Array.isArray(body?.storeIds)
      ? body.storeIds.filter(
          (storeId: unknown): storeId is string =>
            typeof storeId === "string" && storeId.trim().length > 0
        )
      : [];

    if (requestedItems.length === 0 || requestedStoreIds.length === 0) {
      return NextResponse.json({ comparisons: [] });
    }

    const stores = await prisma.store.findMany({
      where: {
        id: { in: requestedStoreIds },
      },
      include: {
        storeItems: {
          where: {
            itemId: { in: requestedItems.map((item) => item.itemId) },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const comparisons = stores
      .filter((store) => isDemoStoreName(store.name))
      .map((store) => {
        const storeItemMap = new Map(
          store.storeItems.map((storeItem) => [storeItem.itemId, Number(storeItem.price)])
        );

        let total = 0;
        let pricedItemCount = 0;
        const missingItems: string[] = [];

        requestedItems.forEach((item) => {
          const price = storeItemMap.get(item.itemId);

          if (price == null) {
            missingItems.push(item.name);
            return;
          }

          total += price * item.quantity;
          pricedItemCount += 1;
        });

        return {
          storeId: store.id,
          storeName: store.name,
          address: formatAddress(store),
          totalPrice: total,
          pricedItemCount,
          missingItemCount: missingItems.length,
          missingItems,
          isComplete: missingItems.length === 0,
        };
      });

    return NextResponse.json({ comparisons });
  } catch (error) {
    console.error("POST /api/store-comparison failed:", error);
    return NextResponse.json(
      { error: "Failed to compare stores" },
      { status: 500 }
    );
  }
}
