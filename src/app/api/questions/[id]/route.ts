import { NextResponse } from "next/server";
import { fetchQuestion } from "@/db/questions";

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
  const question = await fetchQuestion(id);
  if (!question) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(question);
}
