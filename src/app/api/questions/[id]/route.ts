import { NextResponse } from "next/server";
import { getQuestionById } from "@/lib/queries";

type Props = {
  params: Promise<{
    id: string,
  }>,
};

export async function GET(_req: Request, { params }: Props) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }
  const q = await getQuestionById(id);
  if (!q) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(q);
}
