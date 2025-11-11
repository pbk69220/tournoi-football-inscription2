import React, { useState } from 'react'
import type { Registration } from '../App'
import { XIcon } from './Icons'
import './EditRegistrationModal.css'

interface EditRegistrationModalProps {
  registration: Registration
  isOpen: boolean
  onClose: () => void
  onSave: (registration: Registration) => void
  adminPassword: string
}

const SERVICE_LABELS = {
  accommodation2nights: '🏠 Héberger 2 nuits',
  accommodation1night: '🏠 Héberger 1 nuit',
  helpSaturdayMorning: '🤝 Aider samedi matin',
  helpSaturdayAfternoon: '🤝 Aider samedi après-midi',
  helpSundayMorning: '🤝 Aider dimanche matin',
  helpSundayAfternoon: '🤝 Aider dimanche après-midi'
}

export default function EditRegistrationModal({
  registration,
  isOpen,
  onClose,
  onSave,
  adminPassword
}: EditRegistrationModalProps) {
  const [formData, setFormData] = useState<Registration>(registration)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleServiceChange = (service: keyof typeof SERVICE_LABELS) => {
    setFormData({
      ...formData,
      services: {
        ...formData.services,
        [service]: !formData.services[service]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `/api/registrations/${formData.id}?password=${encodeURIComponent(adminPassword)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            playerFirstName: formData.playerFirstName,
            category: formData.category,
            services: formData.services
          })
        }
      )

      if (response.ok) {
        onSave(formData)
        onClose()
        alert('Inscription modifiée avec succès.')
      } else {
        setError('Erreur lors de la modification.')
      }
    } catch (err) {
      setError('Erreur de connexion lors de la modification.')
      console.error('Error updating registration:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Modifier l'inscription</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <XIcon size={24} color="#333" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-section">
            <h3>Informations personnelles</h3>

            <div className="form-group">
              <label htmlFor="name">Nom</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Informations du joueur</h3>

            <div className="form-group">
              <label htmlFor="playerFirstName">Prénom du joueur</label>
              <input
                type="text"
                id="playerFirstName"
                value={formData.playerFirstName}
                onChange={(e) => setFormData({ ...formData, playerFirstName: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Catégorie</label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Services</h3>
            <div className="services-checkboxes">
              {Object.entries(SERVICE_LABELS).map(([service, label]) => (
                <label key={service} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.services[service as keyof typeof SERVICE_LABELS]}
                    onChange={() => handleServiceChange(service as keyof typeof SERVICE_LABELS)}
                    disabled={loading}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Annuler
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
