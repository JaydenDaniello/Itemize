import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      orderBy: { name: "asc" },
    });

    const storesWithImages = stores.map((store) => ({
      ...store,
      imageUrl: `/stores/${store.slug}.jpg`,
    }));

    return Response.json(storesWithImages);
  } catch (err) {
    console.error("API ERROR:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
