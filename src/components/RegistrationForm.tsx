import React, { useState } from 'react'
import type { Registration } from '../App'
import { HomeIcon, UsersIcon, FormIcon, EmailIcon, PhoneIcon, NoteIcon } from './Icons'
import PrivacyModal from './PrivacyModal'
import './RegistrationForm.css'

interface RegistrationFormProps {
  onSubmit: (registration: Omit<Registration, 'id' | 'timestamp'>) => void
}

const SERVICE_LABELS = {
  accommodation2nights: 'Héberger 2 nuits (Vendredi et Samedi soir)',
  accommodation1night: 'Héberger 1 nuit (Samedi soir)',
  helpSaturdayMorning: '1H le Samedi matin',
  helpSaturdayAfternoon: '1H le Samedi après-midi',
  helpSundayMorning: '1H le Dimanche matin',
  helpSundayAfternoon: '1H le Dimanche après-midi'
}

export default function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    playerFirstName: '',
    category: '',
    services: {
      accommodation2nights: false,
      accommodation1night: false,
      helpSaturdayMorning: false,
      helpSaturdayAfternoon: false,
      helpSundayMorning: false,
      helpSundayAfternoon: false
    }
  })

  const [submitted, setSubmitted] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleServiceChange = (service: keyof typeof formData.services) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: !prev.services[service]
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.playerFirstName.trim() || !formData.category.trim()) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    const hasService = Object.values(formData.services).some(v => v === true)
    if (!hasService) {
      alert('Veuillez sélectionner au moins un service')
      return
    }

    onSubmit(formData)
    setFormData({
      name: '',
      email: '',
      phone: '',
      playerFirstName: '',
      category: '',
      services: {
        accommodation2nights: false,
        accommodation1night: false,
        helpSaturdayMorning: false,
        helpSaturdayAfternoon: false,
        helpSundayMorning: false,
        helpSundayAfternoon: false
      }
    })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const selectedCount = Object.values(formData.services).filter(v => v).length

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h2><FormIcon size={24} />Participation à l'organisation</h2>

        <div className="form-group">
          <label htmlFor="name"><NoteIcon size={16} /> Nom et Prénom *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Exemple: Jean Plasse"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email"><EmailIcon size={16} /> Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="exemple@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone"><PhoneIcon size={16} /> Téléphone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="06 12 34 56 78"
            required
          />
        </div>
      </div>

      <div className="form-section">
        <h2><FormIcon size={24} />Info sur le joueur du club</h2>

        <div className="form-group">
          <label htmlFor="playerFirstName"><NoteIcon size={16} />Si je suis un(e) proche d'un joueur du BFB, préciser *</label>
          <input
            type="text"
            id="playerFirstName"
            name="playerFirstName"
            value={formData.playerFirstName}
            onChange={handleInputChange}
            placeholder="Prénom : (Exemple: Martin)"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category"><NoteIcon size={16} /> Catégorie *</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Exemple: U13"
            required
          />
        </div>
      </div>

      <div className="form-section">
        <div className="services-header">
          <h2><HomeIcon size={24} /> Comment pouvez-vous participer ?</h2>
          <span className="selection-count">
            {selectedCount} service{selectedCount !== 1 ? 's' : ''} sélectionné{selectedCount !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="services-grid">
          <div className="service-category">
            <h3><HomeIcon size={20} />Hébergement de 2 joueurs</h3>
            {['accommodation2nights', 'accommodation1night'].map(service => (
              <label key={service} className="service-checkbox">
                <input
                  type="checkbox"
                  checked={formData.services[service as keyof typeof formData.services]}
                  onChange={() => handleServiceChange(service as keyof typeof formData.services)}
                />
                <span>{SERVICE_LABELS[service as keyof typeof SERVICE_LABELS]}</span>
              </label>
            ))}
          </div>

          <div className="service-category">
            <h3><UsersIcon size={20} />Aide sur place</h3>
            <div className="help-grid">
              {['helpSaturdayMorning', 'helpSaturdayAfternoon', 'helpSundayMorning', 'helpSundayAfternoon'].map(service => (
                <label key={service} className="service-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.services[service as keyof typeof formData.services]}
                    onChange={() => handleServiceChange(service as keyof typeof formData.services)}
                  />
                  <span>{SERVICE_LABELS[service as keyof typeof SERVICE_LABELS]}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="privacy-btn"
        onClick={() => setShowPrivacyModal(true)}
      >
        Politique de confidentialité
      </button>

      <button type="submit" className="submit-btn">
        Confirmer ma participation
      </button>

      {submitted && (
        <div className="success-message">
          ✓ Inscription enregistrée avec succès!
        </div>
      )}

      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </form>
  )
}
