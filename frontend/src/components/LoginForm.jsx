import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE ||
  'http://localhost:5000'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

    
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error || 'Erreur serveur')
        return
      }

      const token = data.access_token || data.token
      if (!token) {
        setError('Réponse invalide du serveur (token manquant)')
        console.log('Login response without token:', data)
        return
      }

      localStorage.setItem('token', token)
      localStorage.setItem('username', data.user?.username || username)

      navigate('/dashboard', { replace: true })

    } catch (err) {
      console.error(err)
      setError('Impossible de joindre le serveur')
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input placeholder="Nom d'utilisateur" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Se connecter</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
