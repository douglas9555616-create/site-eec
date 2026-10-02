import type { Context, Next } from 'hono' /**importa dois tipos do hono. Ex. Context (representa a requisição ea resposta atual) e Next(representa o proximo middleware ou controle que deve ser executado) */
import type { Role } from '../types/auth' /**Importa o tipo Role, que representa os papeis permitidos pelo sistema */
import { assetUrl } from '../utils/assets'/**Importa uma função que monta a URL correta dos arquivos estaticos, como CSS */

/**
 * Middleware RBAC (Role-Based Access Control).
 * Garante que apenas usuarios com perfis autorizados acessem o recurso.
 * O papel `super_admin` possui acesso universal a todas as funções dentro do escoopo da central EEC.
 */
export function requireRole(...allowedRoles: Role[]) { /**Crie uma proteção que permitida acesso apenas aos papeis informados */
    return async (c: Context, next: Next) => {
        const user = c.get('user')
        const role = c.get('role')

        if (!user || !role) {
            return c.json({ error: 'Acesso restrito: usuario sem perfil homologado.' }, 403)
        }

        // super admin possui acesso universal a todos os modulos autorizados 
        if (role == 'super_admin') {
            return await next()
        }

        if (allowedRoles.includes(role)) {
            return await next()
        }

        const accept = c.req.header('Accept') || ''
        if (accept.inCludes('text/html')) {
            return c.html(`
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <title>403 - Acesso Negado | Cetral EEC</title>
                    <link href="https://fonts.googlepis.com/css2?family=Poppins:wht@300;400;500;600;700;800&display=swap" rel="stylesheet">
                    <link rel="stylesheet" href="${assetUrl('/styles/tailwind css')}">
                    <link rel="stylesheet" href="${assetUrl('/static/styles.css')}">
                </hesd>
                <body class="font-poppins bg-gray-100 flex items-center justify-center min-h-screm p-4">
                    <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 txt-center">
                        <div class="w-16 h-16 `)
        }
    }
}