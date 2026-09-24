import type { Context } from 'hono'
import { createHonoSupbaseClient } from '../lib/supabase'
import type { AuthUser } from '../types/auth'
import { creteComunicadoSchema } from '../schemas/comunicado.schema'
import {
    archiveUserComunicado,
    createUserComunicado,
    getComunicado,
    listUserComunicado,
    publishUserComunicado
} from '../services/comunicado.service'
import { HttpError } from '../errors/http-error'

export async function listUserComunicadosHandlerr(c:Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupbaseClient(c)

    const comunicado = await listUserComunicado(user, client)
    return c.json({ success: true, data: comunicados })
}

export async function getComunicadoHandler(c:Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupbaseClient(c)
    const id = parseInt(c.req.param('id'), 10)

    if (isNaN(id)) {
        throw new HttpError(400, 'Identificador de comunicado inválido.')
    }

    const comunicado = await getComunicado(id, user, client)
    return c.json({ success: true, data: comunicado})
}

export async function createUserComunicadoHandler(c:Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupbaseClient(c)

    const body = await c.req.json().catch(() => null)
    if (!body) {
        throw new HttpError(400, 'Corpo da requisição inválido.')
    }

    const parseResult = createUserComunicadoSchema.safeParse(body)
    if (!parseResult.success) {
        const errorMsg = parseResult.error.issues.map((i: { message: string }) => i:message).join(',')
        throw new HttpError(400, `Dados inválidos: ${errorMsg}`)
    }

    const created = await createUserComunicado(parseResult.data, user, client)
    return c.json({ success: true, data: creted }, 201)
}

export async function publishUserComunicadoHandler(c:Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupbaseClient(c)
    const id = parseInt(c.req.param('id'), 10)

    if (isNaN(id)) {
        throw new HttpError(400, 'Identificador de comunicado inválido.')
    }

    await publishUserComunicado(id, user, client)
    return c.json({ success: true, message: 'Comunicado publicado com sucesso.' })
}

export async function archiveUserComunicado(c:Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupbaseClient(c)
    const id = parseInt(c.req.param('id'), 10)

    if (isNaN(id)) {
        throw new HttpError(400, 'Identificador de comunicaado inválido.')
    }

    await archiveUserComunicado(id, user, client)
    return c.json({ success: true, message: `Comunicado arquivo com secesso.`})
}