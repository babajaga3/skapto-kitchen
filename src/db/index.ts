import PocketBase, {
  type AuthRecord,
  type RecordAuthResponse,
  type RecordModel
} from 'pocketbase'
import { type ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { ok, err, type ResultAsync } from 'neverthrow'


export const POCKET_BASE_URL = 'https://skapto-pb.thec0derhere.me'
export const POCKET_AUTH_COOKIE = 'pb_auth'

export class DatabaseClient {
  client: PocketBase

  constructor() {
    this.client = new PocketBase(process.env.PB_DB_URL ?? POCKET_BASE_URL) // todo fix this
  }

  async authenticate(
    email: string,
    password: string
  ): Promise<ResultAsync<RecordAuthResponse<RecordModel>, Error>> {
    try {
      const result = await this.client
        .collection('users')
        .authWithPassword(email, password)

      if (!result?.token) {
        return err(new Error('Invalid email or password'))
      }

      return ok(result)
    } catch (error) {
      console.error(error) // todo Remove later

      return err(new Error('Invalid email or password'))
    }
  }

  async register(
    email: string,
    password: string
  ): Promise<ResultAsync<RecordModel | undefined, Error>> {
    try {
      const result = await this.client.collection('users').create({
        email,
        password,
        passwordConfirm: password
      })

      return ok(result)
    } catch (error) {
      console.error(error) // todo remove later

      return err(new Error('Something went wrong'))
    }
  }

  async isAuthenticated(cookieStore: ReadonlyRequestCookies) {
    const cookie = cookieStore.get(POCKET_AUTH_COOKIE)

    if (!cookie) {
      return false
    }

    this.client.authStore.loadFromCookie(cookie?.value || '')

    return this.client.authStore.isValid || false
  }

  async getUser(cookieStore: ReadonlyRequestCookies): Promise<ResultAsync<AuthRecord, Error>> {
    const cookie = cookieStore.get(POCKET_AUTH_COOKIE)

    if (!cookie) {
      return err(new Error('Could not find user'))
    }

    this.client.authStore.loadFromCookie(cookie?.value || '')

    return ok(this.client.authStore.record)
  }
}

export const db = new DatabaseClient()
db.client.autoCancellation(false) // todo remove later
