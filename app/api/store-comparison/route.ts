import { NextRequest, NextResponse } from "next/server";
import { DEMO_CATALOG_ITEMS } from "@/lib/demoCatalog";
import { DEMO_STORES } from "@/lib/demoStores";
import { getCanonicalIngredientName } from "@/lib/normalizeIngredient";

type ComparisonRequestItem = {
  itemId?: string;
  normalizedName?: string;
  quantity?: number;
  name?: string;
};

type ValidComparisonItem = {
  itemId: string;
  normalizedName: string;
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

const demoItemById = new Map(DEMO_CATALOG_ITEMS.map((item) => [item.id, item]));
const demoItemByNormalizedName = new Map(
  DEMO_CATALOG_ITEMS.map((item) => [item.normalizedName, item])
);

function resolveDemoCatalogItem(item: ValidComparisonItem) {
  return (
    demoItemById.get(item.itemId) ??
    demoItemByNormalizedName.get(item.normalizedName) ??
    demoItemByNormalizedName.get(getCanonicalIngredientName(item.name))
  );
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
            normalizedName:
              typeof item.normalizedName === "string" && item.normalizedName.trim().length > 0
                ? item.normalizedName.trim()
                : getCanonicalIngredientName(item.name ?? item.itemId),
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

    const comparisons = DEMO_STORES
      .filter((store) => requestedStoreIds.includes(store.slug))
      .map((store) => {
        let total = 0;
        let pricedItemCount = 0;
        const missingItems: string[] = [];

        requestedItems.forEach((item) => {
          const demoCatalogItem = resolveDemoCatalogItem(item);

          if (!demoCatalogItem) {
            missingItems.push(item.name);
            return;
          }

          total += demoCatalogItem.prices[store.slug] * item.quantity;
          pricedItemCount += 1;
        });

        return {
          storeId: store.slug,
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
