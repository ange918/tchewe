/**
 * Types de la base INNOVA FUND.
 *
 * Généré depuis le projet Supabase. Pour les régénérer après une migration :
 *   npx supabase gen types typescript --project-id zsqnogmtmmvurddgzxdv > src/lib/database.types.ts
 *
 * Les types utilitaires génériques du générateur ont été retirés : seuls le
 * type `Database` et les alias réellement utilisés sont conservés.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type DossierStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'awaiting_next_phase'
  | 'evaluated'
  | 'proofs_submitted'
  | 'financed'
  | 'rejected'

export type DocumentKind = 'project' | 'identity' | 'deposit_receipt' | 'account_proof'
export type UserRole = 'candidate' | 'admin'

export type ProfileRow = {
  id: string
  first_name: string
  last_name: string
  email: string | null
  birth_date: string | null
  role: UserRole
  created_at: string
}

export type DossierRow = {
  id: string
  owner_id: string
  reference: string
  status: DossierStatus
  title: string | null
  amount: number | null
  duration_months: number | null
  summary: string | null
  current_phase: number
  unlock_at: string | null
  review_note: string | null
  submitted_at: string | null
  created_at: string
  updated_at: string
}

export type DocumentRow = {
  id: string
  dossier_id: string
  kind: DocumentKind
  storage_path: string
  file_name: string
  mime_type: string | null
  size_bytes: number | null
  uploaded_at: string
}

export type EligibilityRow = {
  dossier_id: string
  is_adult: boolean
  revenue_share: boolean
  determined: boolean
  guarantee_ready: boolean
  accepted_at: string
}

export type PhaseResultRow = {
  id: string
  dossier_id: string
  phase: number
  score: number
  total: number
  completed_at: string
}

export type FundingProofRow = {
  dossier_id: string
  iban: string
  bank_name: string
  submitted_at: string
}

export type QuizPhaseRow = {
  phase: number
  title: string
  theme: string
  day: string
}

/** Énoncé servi au candidat : sans la bonne réponse, qui ne quitte jamais le serveur. */
export type QuizQuestion = {
  question_id: string
  ordinal: number
  statement: string
  options: string[]
  seconds: number
}

/** Retour de submit_phase_answers : la correction est faite côté serveur. */
export type PhaseOutcome = {
  passed: boolean
  score: number
  total: number
  phase: number
  unlock_at?: string | null
}

// Alias de type, et non `interface` : une interface n'a pas de signature
// d'index implicite et n'est donc pas assignable à la contrainte de schéma
// attendue par createClient — les insertions se résoudraient en `never`.
export type Database = {
  // Attendu par supabase-js pour résoudre les types du schéma : sans lui, les
  // insertions se résolvent en `never` et toute requête typée échoue.
  __InternalSupabase: { PostgrestVersion: '14.18' }
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: Partial<ProfileRow> & { id: string }
        Update: Partial<ProfileRow>
        Relationships: []
      }
      dossiers: {
        Row: DossierRow
        Insert: Partial<DossierRow> & { owner_id: string; reference: string }
        Update: Partial<DossierRow>
        Relationships: []
      }
      documents: {
        Row: DocumentRow
        Insert: Omit<DocumentRow, 'id' | 'uploaded_at'> & { id?: string; uploaded_at?: string }
        Update: Partial<DocumentRow>
        Relationships: []
      }
      eligibility: {
        Row: EligibilityRow
        Insert: EligibilityRow
        Update: Partial<EligibilityRow>
        Relationships: []
      }
      phase_results: {
        Row: PhaseResultRow
        Insert: PhaseResultRow
        Update: Partial<PhaseResultRow>
        Relationships: []
      }
      funding_proofs: {
        Row: FundingProofRow
        Insert: FundingProofRow
        Update: Partial<FundingProofRow>
        Relationships: []
      }
      quiz_phases: {
        Row: QuizPhaseRow
        Insert: QuizPhaseRow
        Update: Partial<QuizPhaseRow>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      ensure_dossier: { Args: Record<PropertyKey, never>; Returns: DossierRow }
      submit_dossier: {
        Args: { p_title: string; p_amount: number; p_duration_months: number; p_summary: string }
        Returns: DossierRow
      }
      accept_eligibility: {
        Args: {
          p_is_adult: boolean
          p_revenue_share: boolean
          p_determined: boolean
          p_guarantee_ready: boolean
        }
        Returns: EligibilityRow
      }
      get_phase_questions: { Args: { p_phase: number }; Returns: QuizQuestion[] }
      submit_phase_answers: { Args: { p_phase: number; p_answers: number[] }; Returns: Json }
      submit_funding: { Args: { p_iban: string; p_bank_name: string }; Returns: FundingProofRow }
      approve_dossier: { Args: { p_dossier_id: string }; Returns: DossierRow }
      reject_dossier: { Args: { p_dossier_id: string; p_note: string }; Returns: DossierRow }
      validate_funding: { Args: { p_dossier_id: string }; Returns: DossierRow }
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
      my_dossier_id: { Args: Record<PropertyKey, never>; Returns: string }
      my_dossier_status: { Args: Record<PropertyKey, never>; Returns: DossierStatus }
    }
    Enums: {
      dossier_status: DossierStatus
      document_kind: DocumentKind
      user_role: UserRole
    }
    CompositeTypes: { [_ in never]: never }
  }
}
