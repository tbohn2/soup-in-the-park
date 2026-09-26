import { NextResponse, type NextRequest } from "next/server";
import { isChristmasSeason } from "@/lib/season";

export function proxy(request: NextRequest) {
  if (!isChristmasSeason()) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = url.pathname === "/" ? "/christmas" : `/christmas${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/", "/gallery"],
};
