import React from 'react'
import ImageSlider from './ImageSlider'
import { HomeIcon, UsersIcon } from './Icons'
import './Presentation.css'

interface PresentationProps {
  onNavigateToInscription?: () => void
}

export default function Presentation({ onNavigateToInscription }: PresentationProps) {
  return (
    <div className="presentation">
      <ImageSlider />

      <div className="presentation-content">
        <div className="intro-section">
          <h2>11ème Edition du tournoi national Cyril Gaiffe</h2>
          <p className="intro-text">
            Les <strong>3 et 4 janvier 2026</strong>, Belleville en Beaujolais accueille la <strong>11ème édition</strong> du prestigieux
            <strong> Trophée Cyril Gaiffe</strong>, Le BFB organise l'un des plus grand tournoi national en salle de football U13 de France avec <strong>24 équipes</strong> participantes.
          </p>
          <div className="tournament-details">
            <p>
              Dans le cadre de ce tournoi, notre club a déjà eu l'honneur d'accueillir des équipes de renommée nationale, notamment l'<strong>Olympique de Marseille</strong>,
              l'<strong>AS Auxerre</strong>, <strong>Thonon Évian</strong>, l'<strong>ESTAC de Troyes</strong>, le <strong>Dijon FCO</strong>,
              le <strong>Clermont Foot</strong>, l'<strong>Olympique Lyonnais</strong>, l'<strong>AS Monaco</strong> et bien d'autres encore.
            </p>
            <p style={{ marginTop: '12px', fontStyle: 'italic', color: '#666' }}>
              C'est un événement exceptionnel et unique pour notre club. Ensemble, faisons de ce tournoi un moment mémorable !
            </p>
          </div>
        </div>

        <div className="highlight-section">
          <div className="highlight-header">
            <h3>Nous avons besoin de vous !</h3>
            <p>Ensemble, faisons de ce tournoi un moment inoubliable</p>
          </div>

          <div className="help-cards">
            <div className="help-card accommodation">
              <div className="card-icon"><HomeIcon size={50} color="#ff6b6b" /></div>
              <h4>Familles d'accueil</h4>
              <p>
                Hébergez <strong>2 jeunes joueurs</strong> pour <strong>1 ou 2 nuits</strong>.
                Confort et sécurité garantis.
              </p>
            </div>

            <div className="help-card volunteer">
              <div className="card-icon"><UsersIcon size={50} color="#00bcd4" /></div>
              <h4>Bénévoles</h4>
              <p>
                Aidez samedi et/ou dimanche pour l'accueil, la buvette ou le buffet.
                Quelques heures suffisent !
              </p>
            </div>
          </div>

          <div className="conclusion">
            <p>
              <strong></strong>
            </p>Rejoignez-nous pour la réussite du tournoi !
          </div>
        </div>

        <div className="cta-section">
          <h3>Comment participer ?</h3>
          <p>Remplissez simplement le formulaire d'inscription</p>
          <button className="cta-btn" onClick={onNavigateToInscription}>
            S'inscrire maintenant
          </button>
        </div>
      </div>
    </div>
  )
}
