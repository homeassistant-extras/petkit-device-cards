import { css } from 'lit';

/**
 * Static CSS styles for the Room Summary Card
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

  .section-title {
    font-weight: 500;
    color: var(--section-color);
    padding: 4px 0 4px 0; /* Reduced top padding for all sections */
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
  }

  .model {
    font-size: 0.9rem;
    color: var(--secondary-text-color);
  }

  .section:not(:last-child) {
    margin-bottom: 40px;
  }

  ha-icon {
    color: var(--icon-color);
    width: 22px;
    height: 22px;
  }

  /* Style for the status colors */

  .status-ok {
    --primary-text-color: var(--success-color);
  }

  .status-warning {
    --primary-text-color: var(--warning-color);
  }

  .status-error {
    --primary-text-color: var(--error-color);
  }

  /* Container for a row */
  .row {
    position: relative;
  }

  /* Style for the percentage bar that goes below the state-card-content */
  .percent-gauge {
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: var(--divider-color, #333);
    overflow: hidden;
    border-radius: 0 0 4px 4px;
  }

  /* The colored fill part of the gauge */
  .percent-gauge-fill {
    height: 100%;
    background-color: var(--primary-color);
    transition:
      width 0.3s ease,
      background-color 0.3s ease;
  }

  /* Color variations based on percentage */
  .percent-gauge-fill.high {
    background-color: var(--success-color, #4caf50);
  }

  .percent-gauge-fill.medium {
    background-color: var(--warning-color, #ffc107);
  }

  .percent-gauge-fill.low {
    background-color: var(--error-color, #f44336);
  }
`;
