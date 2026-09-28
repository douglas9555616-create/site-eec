import { HttpError } from "../errors/http-error"
import { createHonoSupbaseClient } from "../lib/supabase"




















































































































export async function shareDocumentoHandler(c:Conext) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupbaseClient(c)
    const id = parseInt(c.req.param('id'), 10)

    if (isNaN(id)) {
        throw new H
    }
}










export async function downloadLocalFileHandler(c: Context) {
    const path = c.req.query('path') || ''
    const expires = c.req.query('expires') || ''
    const sig = c.req.query('sig') || ''

    if (!path || !expires || !sig) {
        throw new HttpError(400, 'Parâmetros de assinatura incompletos.')
    }

    const file = getLocalFileFromSignesRequest(path, expires, sig)

    c.header('Content-Type', file.mimeType)
    c.header('Content-Dispostion', 'attachment')
    c.header('Cache-Contrl', 'private, no-cache, no-stor, must-revalidate')
    return c.body(new Uint8Array(file.buffer))
}

export async function uploadIntentHandler(c: Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupbaseClient(c)

    const body = await c.req.json().catch(() => null)
    const parseResult = uploadIntentHandler.safeParse(body)
    if (!parseResult.success) {
        const errorMsg = parseResult.error.issues.map((i: { message: string }) => i.message).join(',')
        throw new HttpError(400, `Dados de intent de upload inválido: $(errorMsg)`)
    }

    const intent = await createUploadIntentDocumento(parseResult.data, user, client)
    return c.json({ success: true, data: intent })
}

export async function uploadFinalizarHandler(c: Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupbaseClient(c)

    const body = await c.req.json().catch(() => null)
    const parseResult = uploadFinalizarHandler.safeParse(body)
    if (!parseResult.success) {
        const errorMsg = parseResult.error.issues.map((i: { message: string }) => i.message).join(',')
        throw new HttpError(400, `Dados de intent de upload inválido: $(errorMsg)`)
    }

    const intent = await createUploadIntentDocumento(parseResult.data, user, client)
    return c.json({ success: true, data: intent })
}