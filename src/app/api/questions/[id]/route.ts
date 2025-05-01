import { NextResponse } from "next/server";
import { getQuestionById } from "@/lib/queries";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }
  const q = await getQuestionById(id);
  if (!q) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(q);
}
