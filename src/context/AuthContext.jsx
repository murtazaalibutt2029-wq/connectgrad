import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession]       = useState(null)
  const [profile, setProfile]       = useState(null)
  const [isEmployer, setIsEmployer] = useState(false)
  const [loading, setLoading]       = useState(true)

  async function fetchProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data || null)
  }

  async function fetchEmployerStatus(userId) {
    const { data } = await supabase.from('employer_profiles').select('id').eq('user_id', userId).single()
    setIsEmployer(Boolean(data))
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        Promise.all([fetchProfile(session.user.id), fetchEmployerStatus(session.user.id)])
          .finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        fetchProfile(session.user.id)
        fetchEmployerStatus(session.user.id)
      } else {
        setProfile(null)
        setIsEmployer(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const refreshProfile = () => session?.user && fetchProfile(session.user.id)
  const refreshEmployerStatus = async () => {
    if (session?.user) await fetchEmployerStatus(session.user.id)
  }
  const refreshEmployerStatus = async () => {
    if (session?.user) await fetchEmployerStatus(session.user.id)
  }

  return (
    <AuthContext.Provider value={{ session, profile, isEmployer, loading, refreshProfile, refreshEmployerStatus }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
