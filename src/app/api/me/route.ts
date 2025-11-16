import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = process.env.SECRET_KEY || 'mysecretkey'

interface JWTPayload {
  id: string
  username: string
  role?: string
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token missing', data: null }, { status: 401 })
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY)) as { payload: JWTPayload }
    return NextResponse.json({
      success: true,
      data: {
        userId: payload.id,
        userName: payload.username,
        userRole: payload.role
      }
    })
  } catch (err) {
    console.error('JWT verify failed:', err)
    return NextResponse.json({ success: false, message: 'Invalid token', data: null }, { status: 401 })
  }
}
