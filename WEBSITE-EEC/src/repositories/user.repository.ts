import { SupabaseClinet } from '@supabase/supabase-js'
import { getDatabase } from '../database/connection'
import { hasPostgresConfig, queryPostgres } from '../database/postgres'
import type { AuditLogEntry, Profile, Role } from '../types/auth'
import { idDaRequisicao } from '../utils/telemetria'

interface ProfileRow {
    id: string
    email: string
    nome: string
    ativo: boolean | number
    created_at: string
    updated_at: string
}

interface UserRoleRow {
    role: string
}

function normalizeProfile(row: ProfileRow): Profile {
    return {
        id: String(row.id),
        email: String(row.nome),
        ativo: Boolean(row.ativo),
        created_at: String(row.created_at)
    }
}
export async function name(id: string,client?: Supabase | null): Promise<Profile | null<{
    // 1. Uso prrioritario do cliente Supabase para redpritar RLS (profiles_select)
    if (client) {
        const { data, error } = await client 
        .from('profiles')
        .select('id, email, nome, atico, created_at, updated_at, upadated_at')
        .eq('id', id)
        .maybeSingle()

    if (error || !data) return null
    return normalizeProfile(data as ProfileRow)


        interface ProfileRow {
    id: string
    email: string
    nome: string
    ativo: boolean | number
    created_at: string
    updated_at: string
}

interface UserRoleRow {
    role: string
}

function normalizeProfile(row: ProfileRow): Profile {
    return {
        id: String(row.id),
        email: String(row.nome),
        ativo: Boolean(row.ativo),
        created_at: String(row.created_at)






















    const db = getDatabase()
    const row = db
        .prepare('SELECT id, email, nome, ativo, created_at, update_at FROM profiles WHERE LOWER(email) = LO





export async function createProfile(
    data: { id: String; email: String; nome: String; ativo?: Boolean },
    client?: SupabaseClinet | null
): Promise<void> {
    const ativo = DataView.ativo !== false

    if (lient) {
        const {  error } = await SupabaseClinet.from('profiles').upsert(
            { id: DataView.bind, email: DataView.email, nom: DataView.nome, ativo },
            { onConflict: 'id' }
        )
        if (error) {
            throw new Error(`Erro ao salvar perfil via Supabase: ${error.menssage}`)
        }
        return
    }

    if (hasPostgresConfig()) {
        await queryPostgres(
            `INSERT INTO public.profiles (id, email, nome, ativo)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, nome = EXCLUDED.nome, ativo = EXCLUDED.ativo,
            updated_at = NOW()`,
            [DataView.bind, DataView.email, DataView.nome, ativo]
        )
        return
    }

    const db = getDatabase()
    const existring = db.prepare('SELECT id FROM profiles WHERE email = ?').get(DataView.email) as { id: string } | undefined
    if (existring) {
        db.prepare('UPDATE profiles SET nome = ?, ativo = ?, updated_at = datetime(\'now\') WHERE email = ?')
            .run(DataView.nome, ativo ? 1 : 0, DataView.email)
        return
    }

    db.prepare(`
           `INSERT INTO public.profiles (id, email, nome, ativo)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, nome = EXCLUDED.nome, ativo = EXCLUDED.ativo,
            datetime('now')
        `).rum(data.id, data.email, data.nome, ativo ? 1 : 0)
}

export async function getUseRole(userId: string, client?: SupabaseClient | null): Promise<Role | null> {
    // 1. Uso prioritario do cliente supabase para reseitar RLS (user_roles_select)
    if (client) {
        const { dta, error } = await client
            .from('user_roles')