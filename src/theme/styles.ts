import { css } from 'lit';

/**
 * Static CSS styles for the PetKit Device Card
 * Defines the grid layout and styling for all card elements
 */
export const styles = css`
  :host {
    --icon-color: var(--primary-text-color);
    --section-color: var(--secondary-text-color);
    --row-height: 40px;
  }

  ha-card {
    padding: 16px;
    position: relative;
    z-index: 1;
  }

  .logo {
    height: 60px;
    width: 60px;
  }

  .card-header {
    padding-bottom: 12px;
    border-bottom: 1px solid var(--divider-color);
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-size: 1.5rem;
    font-weight: 500;
    display: flex;
    flex-direction: column;
  }

  /* Style for when card is on fire */
  .problem::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--error-color);
    opacity: 0.08;
    z-index: -1;
  }

  .model {
    font-size: 0.9rem;
    color: var(--secondary-text-color);
  }

  /* Kitty pics */
  .portrait {
    background: none;
  }

  .portrait img {
    width: 100%;
    border-radius: var(--ha-card-border-radius, 12px);
  }

  .portrait .title {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
