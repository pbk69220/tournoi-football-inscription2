import React, { useState } from 'react'
import type { Registration } from '../App'
import ProgressBar from './ProgressBar'
import EditRegistrationModal from './EditRegistrationModal'
import { HomeIcon, UsersIcon, BarChartIcon, XIcon, DownloadIcon, EditIcon } from './Icons'
import './RegistrationList.css'

interface RegistrationListProps {
  registrations: Registration[]
  onDelete: (id: string) => void
  onRefresh?: () => void
  isAdmin?: boolean
  adminPassword?: string
}

const SERVICE_LABELS = {
  accommodation2nights: '🏠 Héberger 2 nuits (Vendredi et Samedi soir)',
  accommodation1night: '🏠 Héberger 1 nuit (Samedi soir)',
  helpSaturdayMorning: '🤝 1H le Samedi matin',
  helpSaturdayAfternoon: '🤝 1H le Samedi après-midi',
  helpSundayMorning: '🤝 1H le Dimanche matin',
  helpSundayAfternoon: '🤝 1H le Dimanche après-midi'
}

export default function RegistrationList({ registrations, onDelete, onRefresh, isAdmin = false, adminPassword = '' }: RegistrationListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [updatedRegistrations, setUpdatedRegistrations] = useState<Registration[]>(registrations)

  // Synchronize updatedRegistrations with registrations when parent updates
  React.useEffect(() => {
    setUpdatedRegistrations(registrations)
  }, [registrations])

  // Capacités d'hébergement
  const ACCOMMODATION_CAPACITY = {
    twoNights: { families: 16, players: 32 },
    oneNight: { families: 8, players: 16 }
  }

  const handleEditSave = (updated: Registration) => {
    setUpdatedRegistrations(updatedRegistrations.map(r => r.id === updated.id ? updated : r))
    setEditingId(null)
    // Refresh data from server to ensure everything is synchronized
    if (onRefresh) {
      onRefresh()
    }
  }

  const stats = {
    total: updatedRegistrations.length,
    accommodation2nights: updatedRegistrations.filter(r => r.services.accommodation2nights).length,
    accommodation1night: updatedRegistrations.filter(r => r.services.accommodation1night).length,
    helpSaturdayMorning: updatedRegistrations.filter(r => r.services.helpSaturdayMorning).length,
    helpSaturdayAfternoon: updatedRegistrations.filter(r => r.services.helpSaturdayAfternoon).length,
    helpSundayMorning: updatedRegistrations.filter(r => r.services.helpSundayMorning).length,
    helpSundayAfternoon: updatedRegistrations.filter(r => r.services.helpSundayAfternoon).length,
  }

  const totalHelpSaturday = stats.helpSaturdayMorning + stats.helpSaturdayAfternoon
  const totalHelpSunday = stats.helpSundayMorning + stats.helpSundayAfternoon

  return (
    <div className="registration-list">
      <div className="charts-section">
        <h2><BarChartIcon size={24} />Etat des inscriptions</h2>

        <div className="charts-grid">
          <div className="chart-container">
            <h3><HomeIcon size={20} />Hébergement 2 nuits</h3>
            <ProgressBar
              current={stats.accommodation2nights}
              max={ACCOMMODATION_CAPACITY.twoNights.families}
              label="Familles"
              subLabel={`Nombre de familles nécessaire: ${ACCOMMODATION_CAPACITY.twoNights.families}`}
              color="purple"
            />
          </div>

          <div className="chart-container">
            <h3><HomeIcon size={20} />Hébergement 1 nuit</h3>
            <ProgressBar
              current={stats.accommodation1night}
              max={ACCOMMODATION_CAPACITY.oneNight.families}
              label="Familles"
              subLabel={`Nombre de familles nécessaire: ${ACCOMMODATION_CAPACITY.oneNight.families}`}
              color="orange"
            />
          </div>
        </div>

        <div className="help-section">
          <h3><UsersIcon size={20} />Aide sur place</h3>
          <div className="help-grid">
            <ProgressBar
              current={stats.helpSaturdayMorning}
              max={20}
              label="Samedi matin"
              color="purple"
            />
            <ProgressBar
              current={stats.helpSaturdayAfternoon}
              max={20}
              label="Samedi après-midi"
              color="blue"
            />
            <ProgressBar
              current={stats.helpSundayMorning}
              max={20}
              label="Dimanche matin"
              color="green"
            />
            <ProgressBar
              current={stats.helpSundayAfternoon}
              max={20}
              label="Dimanche après-midi"
              color="orange"
            />
          </div>
        </div>
      </div>

      <div className="registrations">
          {updatedRegistrations.map((registration, index) => (
            <div key={registration.id} className="registration-card">
              <div className="card-header">
                <div className="card-number">#{index + 1}</div>
                {isAdmin && (
                  <div className="card-actions">
                    <button
                      className="edit-btn"
                      onClick={() => setEditingId(registration.id)}
                      title="Modifier l'inscription"
                    >
                      <EditIcon size={20} color="#667eea" />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        if (confirm(`Êtes-vous sûr de vouloir supprimer l'inscription de ${registration.name} ?`)) {
                          onDelete(registration.id)
                        }
                      }}
                      title="Supprimer l'inscription"
                    >
                      <XIcon size={20} color="#d32f2f" />
                    </button>
                  </div>
                )}
              </div>

              <div className="card-content">
                <h3>{registration.name}</h3>
                {isAdmin && (
                  <div className="contact-info">
                    <p><strong>Email:</strong> <a href={`mailto:${registration.email}`}>{registration.email}</a></p>
                    <p><strong>Téléphone:</strong> <a href={`tel:${registration.phone}`}>{registration.phone}</a></p>
                  </div>
                )}
                <div className="player-info">
                  <p><strong>Joueur:</strong> {registration.playerFirstName}</p>
                  <p><strong>Catégorie:</strong> {registration.category}</p>
                </div>

                <div className="services-list">
                  <h4>Participation:</h4>
                  <ul>
                    {Object.entries(registration.services)
                      .filter(([_, selected]) => selected)
                      .map(([service]) => (
                        <li key={service}>
                          {SERVICE_LABELS[service as keyof typeof SERVICE_LABELS]}
                        </li>
                      ))}
                  </ul>
                </div>

                <div className="card-date">
                  Inscrit le {new Date(registration.timestamp).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
      </div>

      {updatedRegistrations.length > 0 && isAdmin && (
        <div className="export-section">
          <button
            className="export-btn"
            onClick={() => {
              const csvContent = generateCSV(updatedRegistrations)
              downloadCSV(csvContent, 'inscriptions.csv')
            }}
          >
            <DownloadIcon size={18} />
            <span>Exporter en CSV</span>
          </button>
        </div>
      )}

      {editingId && (
        <EditRegistrationModal
          registration={updatedRegistrations.find(r => r.id === editingId)!}
          isOpen={true}
          onClose={() => setEditingId(null)}
          onSave={handleEditSave}
          adminPassword={adminPassword}
        />
      )}
    </div>
  )
}

function generateCSV(registrations: Registration[]): string {
  const headers = ['Nom', 'Email', 'Téléphone', 'Joueur', 'Catégorie', 'Héberger 2 nuits', 'Héberger 1 nuit',
                   'Aider sam. matin', 'Aider sam. après-midi', 'Aider dim. matin',
                   'Aider dim. après-midi', 'Date inscription']

  const rows = registrations.map(r => [
    r.name,
    r.email,
    r.phone,
    r.playerFirstName,
    r.category,
    r.services.accommodation2nights ? 'Oui' : 'Non',
    r.services.accommodation1night ? 'Oui' : 'Non',
    r.services.helpSaturdayMorning ? 'Oui' : 'Non',
    r.services.helpSaturdayAfternoon ? 'Oui' : 'Non',
    r.services.helpSundayMorning ? 'Oui' : 'Non',
    r.services.helpSundayAfternoon ? 'Oui' : 'Non',
    new Date(r.timestamp).toLocaleDateString('fr-FR')
  ])

  const csvRows = [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ]

  return csvRows.join('\n')
}

function downloadCSV(content: string, filename: string) {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(content))
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
