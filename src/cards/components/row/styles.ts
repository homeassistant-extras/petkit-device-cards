import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
  }

  ha-icon {
    color: var(--icon-color, var(--primary-text-color));
    width: 22px;
    height: 22px;
  }

  .row {
    position: relative;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .row:hover {
    background-color: var(--secondary-background-color);
  }

  .row.status-ok {
    border-left: 2px solid var(--success-color);
  }
  .status-ok {
    --primary-text-color: var(--success-color);
  }

  /* Style for the status colors */
  .row.status-warning {
    border-left: 2px solid var(--warning-color);
  }
  .status-warning {
    --primary-text-color: var(--warning-color);
  }

  .row.status-error {
    border-left: 2px solid var(--error-color);
  }
  .status-error {
    --primary-text-color: var(--error-color);
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
