import { api } from "@/shared/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await api.post("/auth/register", body);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || "An error occurred" },
      { status: error.response?.status || 500 }
    );
  }
}
