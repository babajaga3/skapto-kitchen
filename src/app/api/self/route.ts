import { NextRequest } from 'next/server'
import { internalServerError, notFound, ok, unauthorized } from '@/lib/api'
import { verifyUser } from '@/lib/utils'


export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('pb_auth')?.value

    // If token is not present, return a 401 response
    if (!token) {
      return unauthorized('Invalid token')
    }

    // Get user from db
    const { user } = await verifyUser(token)

    if (!user) {
      // If user is not found, return a 401 response
      return unauthorized('Invalid user')
    }

    return ok(user)
  } catch (error) {
    // If there's an error, return a 500 response
    return internalServerError(error, 'An error occurred. Failed to fetch user.')
  }
}
