import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  console.log("searchParams:: ", searchParams.get("query"));
  const data = await prisma.user.findMany();

  return Response.json(
    {
      success: true,
      data,
    },
    { status: 200 }
  );
}
