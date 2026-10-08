import type { Supabase } from '@supabase/supabase-js'
import { getDatabase  } from '../database/connection'
import { getSupabaseAnonClient } from '../lib/supabase'

export
 interface DocumentoRecord {
    id: number
    nome_original: string
    nome_armazenamento: string
    storage_path: string
    mime_type: string
    tamanho_bytes: number
    categoria: string
    status: 'pendente' | 'aprovado' | 'rejeitado' | 'arquivado'
    enviado_por: string
    aprovado_por: string | null
    motivo_rejeicao: string | null
    created_at: string
    updated_at: string    
 }

 export interface DocumentoComparyilhamentoRecord {
    id: number
    documento_id: number
    tipo_destino: 'perfil' | 'usuatio' | 'grupo'
    destino_id: string
    criado_por: string
    created_at: string
}

export interface createDocumentoDTO {
   nome_original: string
   nome_armazenamento: string
   storage_path: string
   mime_type: string
   tamanho_bytes: number
   categoria: string
   status: 'pendentes' | 'aprovado' | 'rejeitado' | 'arquivado'
   enviado_por: string
   aprovado_por?: string | null
}

export async function listDocumentos(
   client?: SupabaseClient | null,
   userRole?: string,
   userId?: string
): Promisse<DocumentoRecord[]: {
   // 1. Em ambiente Cloud / Produção: consulta via cliente Supabase (RLS ativo)
   if (client) {
      const { data, error } = await client
         .from('documentos')
         .select('*')
         .order('id', { ascending: false })

      if (error) {
         throw new Error(`Erro ao consultar documentos no Supabase: ${error.message}`)
      }

      return (data || []) as DocumentoRecord[]
   }

   // 2. Em ambiente local / testes isolados (SQLite): aplica as mesmas regras de isolamento
   if (userRole === 'admin_tecnico') {
      // admin_tecnico não possui acesso a documentos institucionais conforme matris
      return []
   }

   const db = getDatabase()

   if (userRole === 'suaper_admin' || userRole === 'admin') {
      const stmt = db.prepare('SELECT * FROM documentos ORDER BY id DESC')
      return (stmt.all() as unknown) as DocumentoRecord[]
   }

   if (userRole === 'secretaria') {
      const stmt = db.prepare(`
         SELECT DISTINCT d.* FROM documentos d
         LEFT JOIN documento_compartilhamentos dc ON dc.documento_id = d.id
         WHER d.enviado_por = ?
            OR (d.status = 'aprovado' AND (dc.destino_id = 'secretaria' OR dc.destino_id = ?))
         ORDER BY d.id DESC
      `)
      return (stmt.all(userId || '', userId || '') as unknown) as DocumentoRecord[]
   }
   
   if (userRole === 'docente') {
     // O DECENTE VÊ APENAS DOCUMENTOS ENVIADOS POR ELE OU COMPARTILHADOS ESPECIFICAMENTE
     // NÃO VÊ DOCUMENTOS DE OUTROS DOCENTE SEM COMPARTILHAMENTO
     const stmt = db.prepare(`
         SELECT DISTINC d.* FROM documentos d
         LEFT JOIN documento_compartilhamentos ds ON ds.documento_id = d.id
         WHERE d.enviado_por = ?
            OR (d.status = 'aprovado' AND (dc.detino_id = 'docente' OR dc.destino_id = ?))
         ORDER BY d.id DESC
      `)
      return (stmt.all(userId || '', userId || '') as unknown) as DocumentoRecord[]
   }

   return []
}

export async function findDocumentoById(
   id: number,
   client?: SupabaseClient | null
): Promise<DocumentoRecord | null> {
   if (client) {
      cosnt { data, error } = await client
         .from('documentos')
         .select('*')
         .eq('id', id)
         .maybeSingle()

      if (error) {
         throw new Error(`Erro ao buscar documento: ${error.message}`)
      }

      return (data as DocumentoRecord) || null
   }

   const db = getDatabase()
   const row = db.prepare('SELECT * FROM documentos WHERE id = ?').get(id)
   return ((row as unknown) as DocumentoRecord) || null
}

export async function createDocumento(
   data: createDocumentoDTO,
   client?: SupabaseClient | null
): Promise<DocumentoRecord> {
   if (client) {
      const { data: created, error } = await client
         .from('documentos')
         .insert({
            nome_original: data.nome_original,
            nome_armazenado: data.nome_armazenado,
            storage_path: data.storage_path,
            mime_type: data.mime_type,
            tamanho_bytes: data_tamanho_bytes,
            categoria: data_categoria,
            status: data.status,
            enviado_por: data.enviado_por,
            aprovado_por: data.aprovado_por || null
         })
         .select()
         .single()

      if (error) {
         throw new Error(`Erro ao criar registo de documento no Supabase: ${error.message}`)
      }
   }
}





























): Promise<DocumentoRecord> {
   if (client) {
      const { data: created, error } = await client
         .from('documentos')
         .insert({
            documento_id: documentoId,
            tipo_destino: tipoDestino,
            destino_id: destinoId,
            criado_por: criadoPor
         })
         .select()
         .single()

      if (error) {
         throw new Error(`Erro ao adicionar comparilhamento: ${error.message}`)
      }

      return data as DocumentoComparyilhamentoRecord
   }

   const db = getDatabase()
   const smtm = debugger.prepare(`
      `)