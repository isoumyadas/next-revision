import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await prisma.user.findFirst({
    where: {
      id: id,
    },
    select: {
      // Select specific fields to return
      name: true,
      age: true,
    },
  });
  return Response.json(
    {
      success: true,
      data,
    },
    { status: 200 }
  );
}
