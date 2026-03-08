// NOTE:
// This route currently returns mock but real store data.
// When the database is hooked up, replace the mock array with a real Prisma query.

export async function GET() {
  const stores = [
    {
      id: "walmart-001",
      name: "Walmart Supercenter",
      address: "2887 S Arlington Rd",
      city: "Akron",
      state: "OH",
      zip: "44312",
      imageUrl: "/stores/Walmart.jpg",
    },
    {
      id: "target-001",
      name: "Target",
      address: "449 Howe Ave",
      city: "Cuyahoga Falls",
      state: "OH",
      zip: "44221",
      imageUrl: "/stores/Target.png",
    },
    {
      id: "wholefoods-001",
      name: "Whole Foods Market",
      address: "1745 W Market St",
      city: "Akron",
      state: "OH",
      zip: "44313",
      imageUrl: "/stores/WF.jfif",
    },
    {
      id: "gianteagle-001",
      name: "Giant Eagle",
      address: "230 Howe Ave",
      city: "Cuyahoga Falls",
      state: "OH",
      zip: "44221",
      imageUrl: "/stores/GE.jpg",
    },
    {
      id: "aldi-001",
      name: "Aldi",
      address: "772 S Main St",
      city: "Akron",
      state: "OH",
      zip: "44311",
      imageUrl: "/stores/Aldi.jpg",
    },
    {
      id: "aldi-002",
      name: "Aldi",
      address: "1620 Brittain Rd",
      city: "Akron",
      state: "OH",
      zip: "44310",
      imageUrl: "/stores/Aldi.jpg",
    },
  ]

  return Response.json(stores)
}
