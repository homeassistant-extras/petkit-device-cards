import { css } from 'lit';

/**
 * Styles for `petkit-device-section`.
 *
 * The component uses its own shadow root; section + row layout styles live here.
 */
export const styles = css`
  :host {
    --icon-color: var(--primary-text-color);
    --section-color: var(--secondary-text-color);
    --row-height: 40px;
    display: block;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .section-title {
    font-weight: 500;
    color: var(--section-color);
    padding: 4px 0 4px 0;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
  }

  .section-chevron {
    cursor: pointer;
    transition: transform 0.3s ease;
    color: var(--secondary-text-color);
    display: flex;
    align-items: center;
  }

  .section-footer {
    text-align: center;
    padding: 4px 0;
  }

  .show-more {
    color: var(--primary-color);
    cursor: pointer;
    font-size: 0.9rem;
    padding: 4px 0;
  }

  .show-more:hover {
    text-decoration: underline;
  }

  .section {
    margin-bottom: 16px;
  }

  .section.expanded:not(:last-child),
  .section.few-items:not(:last-child) {
    margin-bottom: 40px;
  }

  ha-icon {
    color: var(--icon-color);
    width: 22px;
    height: 22px;
  }
`;
