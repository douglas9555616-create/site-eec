import type { Context } fom 'hono'

export function getHealth(c: Context) {
    return c.json({ status: 'ok' }, 200)
}