import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  getUserPreference,
  upsertUserPreference,
} from "@/lib/db/userPreferences";
import {
  getAllStorePreferences,
  upsertStorePreference,
  deleteStorePreference,
} from "@/lib/db/storePreferences";
import { listStores } from "@/lib/db/stores";

type OptimizeFor = "cost" | "convenience";

type StorePreferenceInput = {
  storeId: string;
  isFavorite: boolean;
  isExcluded: boolean;
};

function decimalToString(value: unknown) {
  if (value == null) return null;
  return String(value);
}

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [userPreference, stores, storePreferences] = await Promise.all([
      getUserPreference(user.id),
      listStores(),
      getAllStorePreferences(user.id),
    ]);

    const preferenceMap = new Map(
      storePreferences.map((pref) => [pref.storeId, pref])
    );

    const mergedStores = stores.map((store) => {
      const pref = preferenceMap.get(store.id);

      return {
        storeId: store.id,
        name: store.name,
        address: store.address,
        city: store.city,
        state: store.state,
        zip: store.zip,
        isFavorite: pref?.isFavorite ?? false,
        isExcluded: pref?.isExcluded ?? false,
      };
    });

    return NextResponse.json({
      userPreference: {
        optimizeFor:
          (userPreference?.optimizeFor as OptimizeFor | undefined) ?? "cost",
        monthlyBudget: decimalToString(userPreference?.monthlyBudget),
        perTripBudget: decimalToString(userPreference?.perTripBudget),
      },
      stores: mergedStores,
    });
  } catch (error) {
    console.error("GET /api/preferences failed:", error);
    return NextResponse.json(
      { error: "Failed to load preferences" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const optimizeFor = body.optimizeFor as OptimizeFor;
    const monthlyBudgetRaw = body.monthlyBudget as string;
    const perTripBudgetRaw = body.perTripBudget as string;
    const storePreferencesRaw = Array.isArray(body.storePreferences)
      ? body.storePreferences
      : [];

    if (optimizeFor !== "cost" && optimizeFor !== "convenience") {
      return NextResponse.json(
        { error: "Invalid optimizeFor value" },
        { status: 400 }
      );
    }

    const monthlyBudget =
      monthlyBudgetRaw?.trim() === "" ? null : Number(monthlyBudgetRaw);
    const perTripBudget =
      perTripBudgetRaw?.trim() === "" ? null : Number(perTripBudgetRaw);

    if (
      (monthlyBudget !== null &&
        (!Number.isFinite(monthlyBudget) || monthlyBudget < 0)) ||
      (perTripBudget !== null &&
        (!Number.isFinite(perTripBudget) || perTripBudget < 0))
    ) {
      return NextResponse.json(
        { error: "Budget values must be valid non-negative numbers" },
        { status: 400 }
      );
    }

    const validatedStorePreferences: StorePreferenceInput[] = [];

    for (const pref of storePreferencesRaw) {
      if (
        typeof pref.storeId !== "string" ||
        typeof pref.isFavorite !== "boolean" ||
        typeof pref.isExcluded !== "boolean"
      ) {
        return NextResponse.json(
          { error: "Invalid store preference payload" },
          { status: 400 }
        );
      }

      if (pref.isFavorite && pref.isExcluded) {
        return NextResponse.json(
          { error: "A store cannot be both favorite and excluded" },
          { status: 400 }
        );
      }

      validatedStorePreferences.push({
        storeId: pref.storeId,
        isFavorite: pref.isFavorite,
        isExcluded: pref.isExcluded,
      });
    }

    await upsertUserPreference(user.id, {
      optimizeFor,
      monthlyBudget,
      perTripBudget,
    });

    await Promise.all(
      validatedStorePreferences.map((pref) => {
        if (!pref.isFavorite && !pref.isExcluded) {
          return deleteStorePreference(user.id, pref.storeId).catch(() => null);
        }

        return upsertStorePreference(user.id, pref.storeId, {
          isFavorite: pref.isFavorite,
          isExcluded: pref.isExcluded,
        });
      })
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/preferences failed:", error);
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 }
    );
  }
}