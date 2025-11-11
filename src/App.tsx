import React, { useState } from 'react'
import RegistrationForm from './components/RegistrationForm'
import RegistrationList from './components/RegistrationList'
import Presentation from './components/Presentation'
import AdminLogin from './components/AdminLogin'
import { FootballIcon, ListIcon, InfoIcon, FormIcon, LockIcon } from './components/Icons'
import './App.css'

export interface Registration {
  id: string
  name: string
  email: string
  phone: string
  playerFirstName: string
  category: string
  services: {
    accommodation2nights: boolean
    accommodation1night: boolean
    helpSaturdayMorning: boolean
    helpSaturdayAfternoon: boolean
    helpSundayMorning: boolean
    helpSundayAfternoon: boolean
  }
  timestamp: number
}

export default function App() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [currentTab, setCurrentTab] = useState<'presentation' | 'inscription' | 'recap' | 'admin' | 'login'>('presentation')
  const [loading, setLoading] = useState(false)

  // Fetch registrations with useCallback to update when isAdmin changes
  const fetchRegistrations = React.useCallback(async () => {
    try {
      setLoading(true)
      // Use admin endpoint if authenticated to get full data
      const url = isAdmin && adminPassword
        ? `/api/registrations/admin/full?password=${encodeURIComponent(adminPassword)}`
        : '/api/registrations'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setRegistrations(data)
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
    } finally {
      setLoading(false)
    }
  }, [isAdmin, adminPassword])

  // Load registrations on mount and when admin status changes
  React.useEffect(() => {
    fetchRegistrations()
  }, [fetchRegistrations])

  const handleAddRegistration = async (registration: Omit<Registration, 'id' | 'timestamp'>) => {
    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registration)
      })

      if (response.ok) {
        alert('Inscription enregistrée avec succès! Merci pour votre participation.')
        // Refetch all registrations to sync with server
        await fetchRegistrations()
      } else {
        alert('Erreur lors de l\'enregistrement. Veuillez réessayer.')
      }
    } catch (error) {
      console.error('Error adding registration:', error)
      alert('Erreur de connexion. Assurez-vous que le serveur est démarré.')
    }
  }

  const handleDeleteRegistration = async (id: string) => {
    try {
      const response = await fetch(`/api/registrations/${id}?password=${encodeURIComponent(adminPassword)}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setRegistrations(registrations.filter(r => r.id !== id))
        alert('Inscription supprimée avec succès.')
      } else {
        alert('Erreur lors de la suppression.')
      }
    } catch (error) {
      console.error('Error deleting registration:', error)
      alert('Erreur de connexion lors de la suppression.')
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <img src="/Images/image_head.jpg" alt="Tournoi National de Football" className="header-image" />
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${currentTab === 'presentation' ? 'active' : ''}`}
          onClick={() => setCurrentTab('presentation')}
        >
          <InfoIcon size={18} />
          <span>Présentation</span>
        </button>
        <button
          className={`nav-btn ${currentTab === 'inscription' ? 'active' : ''}`}
          onClick={() => setCurrentTab('inscription')}
        >
          <FormIcon size={18} />
          <span>Inscription</span>
        </button>
        <button
          className={`nav-btn ${currentTab === 'recap' ? 'active' : ''}`}
          onClick={() => setCurrentTab('recap')}
        >
          <ListIcon size={18} />
          <span>Récapitulatif ({registrations.length})</span>
        </button>
        {isAdmin && (
          <button
            className={`nav-btn ${currentTab === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentTab('admin')}
          >
            <FormIcon size={18} />
            <span>Admin</span>
          </button>
        )}
        <button
          className={`nav-btn ${isAdmin ? '' : 'admin-login-btn'}`}
          onClick={() => {
            if (!isAdmin) {
              setCurrentTab('login')
            } else {
              setIsAdmin(false)
              setAdminPassword('')
              setCurrentTab('presentation')
            }
          }}
        >
          <LockIcon size={18} />
          <span>{isAdmin ? 'Déconnexion' : 'Admin'}</span>
        </button>
      </nav>

      <main className="app-main">
        {currentTab === 'presentation' && <Presentation onNavigateToInscription={() => setCurrentTab('inscription')} />}
        {currentTab === 'inscription' && (
          <RegistrationForm onSubmit={handleAddRegistration} />
        )}
        {currentTab === 'recap' && (
          <RegistrationList
            registrations={registrations}
            onDelete={handleDeleteRegistration}
            onRefresh={fetchRegistrations}
            isAdmin={false}
          />
        )}
        {currentTab === 'admin' && isAdmin && (
          <RegistrationList
            registrations={registrations}
            onDelete={handleDeleteRegistration}
            onRefresh={fetchRegistrations}
            isAdmin={true}
            adminPassword={adminPassword}
          />
        )}
        {currentTab === 'login' && !isAdmin && (
          <AdminLogin
            onLogin={(password) => {
              setAdminPassword(password)
              setIsAdmin(true)
              setCurrentTab('admin')
            }}
          />
        )}
      </main>
    </div>
  )
}
