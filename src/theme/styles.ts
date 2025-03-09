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
  }

  .card-header {
    font-size: 1.5rem;
    font-weight: 500;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--divider-color);
    margin-bottom: 8px;
  }

  .problem {
    background: rgba(var(--rgb-error), 0.15);
  }

  .section {
    font-weight: 500;
    color: var(--section-color);
    padding: 8px 0 4px 0;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--row-height);
    padding: 0 4px;
  }

  .row:nth-child(even) {
    background-color: rgba(var(--rgb-primary-text-color), 0.04);
    border-radius: 4px;
  }

  .value-wrapper {
    display: flex;
    align-items: center;
    font-weight: 500;
  }

  .label-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  ha-icon {
    color: var(--icon-color);
    width: 22px;
    height: 22px;
  }

  .status-ok {
    color: var(--success-color);
  }

  .status-warning {
    color: var(--warning-color);
  }

  .status-error {
    color: var(--error-color);
  }

  .filter-percentage {
    position: relative;
    width: 40px;
    height: 16px;
    background-color: rgba(var(--rgb-primary-text-color), 0.1);
    border-radius: 8px;
    overflow: hidden;
    margin-right: 8px;
  }

  .filter-fill {
    position: absolute;
    height: 100%;
    border-radius: 8px;
    left: 0;
    top: 0;
  }
`;
