import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { parseSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const user = parseSessionToken(token)

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
