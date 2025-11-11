import React from 'react'
import { XIcon } from './Icons'
import './PrivacyModal.css'

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null

  return (
    <div className="privacy-modal-overlay" onClick={onClose}>
      <div className="privacy-modal" onClick={(e) => e.stopPropagation()}>
        <div className="privacy-modal-header">
          <h2>Mention d'information RGPD</h2>
          <button className="privacy-modal-close" onClick={onClose}>
            <XIcon size={24} />
          </button>
        </div>

        <div className="privacy-modal-content">
          <p>
            Les informations recueillies dans ce formulaire sont enregistrées par le Belleville Foot Beaujolais (BFB) dans le cadre de l'organisation du Trophée National Cyril Gaiffe 2026.
          </p>

          <p>
            Elles sont collectées afin de coordonner les bénévoles, les parents participants et faire un état des participations. 
          </p>

          <p>
            Les données collectées (nom, prénom, coordonnées, disponibilités, etc.) sont strictement confidentielles et ne seront pas transmises à des tiers.
          </p>

          <p>
            Elles seront conservées jusqu'à la fin de la saison puis supprimées.
          </p>

          <p>
            Conformément au Règlement Général sur la Protection des Données (UE) 2016/679, vous pouvez exercer vos droits d'accès, de rectification ou de suppression de vos données en contactant :
          </p>

          <p className="privacy-modal-email">
            📧 bellevillefootballbeaujolais@gmail.com<br />
            
          </p>

          <p>
            En soumettant ce formulaire, vous consentez au traitement de vos données pour cette finalité.
          </p>
        </div>

        <div className="privacy-modal-footer">
          <button className="privacy-modal-btn" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
