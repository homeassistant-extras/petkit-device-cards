import { getDevice } from '@delegates/retrievers/device';
import { getDeviceEntities } from '@delegates/utils/card-entities';
import { isPetKit } from '@delegates/utils/is-petkit';
import type { HomeAssistant } from '@hass/types';
import { styles } from '@theme/styles';
import type { Config, PetKitUnit } from '@type/config';
import { CSSResult, html, LitElement, nothing, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { version } from '../../package.json';
const equal = require('fast-deep-equal');

export class PetKitDevice extends LitElement {
  /**
   * Card configuration object
   */
  @state()
  private _config!: Config;

  /**
   * PetKit Unit information
   */
  @state()
  protected _unit!: PetKitUnit;

  /**
   * Home Assistant instance
   * Not marked as @state as it's handled differently
   */
  private _hass!: HomeAssistant;

  constructor() {
    super();
    console.info(
      `%c🐱 Poat's Tools: petkit-device-card - ${version}`,
      'color: #CFC493;',
    );
  }
  /**
   * Returns the component's styles
   */
  static override get styles(): CSSResult {
    return styles;
  }

  /**
   * Sets up the card configuration
   * @param {Config} config - The card configuration
   */
  setConfig(config: Config) {
    if (!equal(config, this._config)) {
      this._config = config;
    }
  }

  /**
   * Updates the card's state when Home Assistant state changes
   * @param {HomeAssistant} hass - The Home Assistant instance
   */
  set hass(hass: HomeAssistant) {
    this._hass = hass;

    const unit: PetKitUnit = {
      sensors: [],
      diagnostics: [],
      configurations: [],
    };

    const device = getDevice(hass, this._config.device_id);
    if (!device) {
      return;
    }

    unit.name = device.name || 'PetKit Device';

    const entities = getDeviceEntities(hass, device.id);
    if (entities.length) {
      entities.forEach((entity) => {
        if (entity.category === 'diagnostic') {
          unit.diagnostics.push(entity);
        } else if (entity.category === 'config') {
          unit.configurations.push(entity);
        } else {
          unit.sensors.push(entity);
        }
      });
    }

    if (!equal(unit, this._unit)) {
      this._unit = unit;
    }
  }

  // card configuration
  static getConfigElement() {
    return document.createElement('petkit-device-editor');
  }

  public static async getStubConfig(hass: HomeAssistant): Promise<Config> {
    const device = Object.values(hass.devices).find(isPetKit);

    return {
      device_id: device?.id || '',
    };
  }

  /**
   * Get icon based on entity ID or device class
   * @param {string} entityId - The entity ID
   * @param {string} deviceClass - The device class
   * @returns {string} The icon name
   */
  private _getIconForEntity(entityId: string, deviceClass?: string): string {
    // Default icons based on device class
    if (deviceClass) {
      switch (deviceClass) {
        case 'battery':
          return 'mdi:battery';
        case 'energy':
          return 'mdi:flash';
        case 'timestamp':
          return 'mdi:clock-outline';
        case 'water':
          return 'mdi:water';
        case 'config':
          return 'mdi:cog';
      }
    }

    // Icons based on entity ID content
    if (entityId.includes('filter')) return 'mdi:filter';
    if (entityId.includes('water')) return 'mdi:water';
    if (entityId.includes('energy')) return 'mdi:flash';
    if (entityId.includes('ble') || entityId.includes('bluetooth'))
      return 'mdi:bluetooth';
    if (entityId.includes('update') || entityId.includes('last'))
      return 'mdi:clock-outline';
    if (entityId.includes('purified')) return 'mdi:water-pump';
    if (entityId.includes('filters') || entityId.includes('spare'))
      return 'mdi:package-variant-closed';

    // Default fallback
    return 'mdi:information-outline';
  }

  /**
   * Get user-friendly label from entity ID
   * @param {string} entityId - The entity ID
   * @returns {string} The formatted label
   */
  private _getLabelFromEntityId(entityId: string): string {
    // Extract the part after the last dot
    const parts = entityId.split('.');
    const name = parts[parts.length - 1];

    // Replace underscores with spaces and capitalize each word
    return name!
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Renders a section with its rows
   * @param {string} title - Section title
   * @param {Array} entities - List of entities to render
   * @returns {TemplateResult} The rendered section
   */
  private _renderSection(title: string, entities: any[]): TemplateResult {
    if (!entities || entities.length === 0) {
      return html``;
    }

    return html`
      <div class="section">${title}</div>
      ${entities.map((entity) => this._renderEntityRow(entity))}
    `;
  }

  /**
   * Renders a single entity row
   * @param {object} entity - The entity to render
   * @returns {TemplateResult} The rendered row
   */
  private _renderEntityRow(entity: any): TemplateResult {
    const icon = this._getIconForEntity(
      entity.entity_id,
      entity.attributes.device_class,
    );
    const label =
      entity.attributes.friendly_name ||
      this._getLabelFromEntityId(entity.entity_id);

    return html`
      <div class="row">
        <div class="label-wrapper">
          <ha-icon icon="${icon}"></ha-icon>
          <span>${label}</span>
        </div>
        <div class="value-wrapper">${this._renderValue(entity.entity_id)}</div>
      </div>
    `;
  }

  /**
   * renders the lit element card
   * @returns {TemplateResult} The rendered HTML template
   */
  override render(): TemplateResult | typeof nothing {
    if (!this._config || !this._hass || !this._unit) {
      return nothing;
    }

    const problem_state = this._hass.states['this.problem_entity'];
    const hasProblem = problem_state && problem_state.state === 'on';

    return html`
      <ha-card class="${hasProblem ? 'problem' : ''}">
        <div class="card-header">${this._config.title || this._unit.name}</div>

        ${this._renderSection('Configuration', this._unit.configurations)}
        ${this._renderSection('Sensors', this._unit.sensors)}
        ${this._renderSection('Diagnostic', this._unit.diagnostics)}
      </ha-card>
    `;
  }

  private _getStatusClass(state: string): string {
    if (state === 'on' || state === 'unavailable') {
      return 'status-error';
    }
    if (state === 'off') {
      return 'status-ok';
    }
    return '';
  }

  private _renderValue(entity_id: string): TemplateResult {
    const state = this._hass.states[entity_id];

    if (!state) {
      return html`<span>Unavailable</span>`;
    }

    if (
      state.attributes.device_class === 'battery' ||
      entity_id.includes('filter_remaining')
    ) {
      const percentage = Number(state.state);
      const color =
        percentage > 60
          ? 'var(--success-color)'
          : percentage > 30
            ? 'var(--warning-color)'
            : 'var(--error-color)';

      return html`
        <div class="filter-percentage">
          <div
            class="filter-fill"
            style=${styleMap({
              width: `${percentage}%`,
              backgroundColor: color,
            })}
          ></div>
        </div>
        <span
          >${state.state}${state.attributes.unit_of_measurement || '%'}</span
        >
      `;
    }

    if (state.attributes.device_class === 'energy') {
      return html`<span
        >${state.state} ${state.attributes.unit_of_measurement || 'kWh'}</span
      >`;
    }

    if (
      entity_id.includes('last_update') ||
      entity_id.includes('last_ble_connection')
    ) {
      if (state.state.includes('unavailable'))
        return html`<span>Unavailable</span>`;
      return html`<span>${state.state}</span>`;
    }

    if (
      entity_id.includes('water_lack_warning') ||
      entity_id.includes('replace_filter')
    ) {
      return html`<span class="${this._getStatusClass(state.state)}"
        >${state.state === 'on' ? 'Warning' : 'OK'}</span
      >`;
    }

    return html`<span
      >${state.state} ${state.attributes.unit_of_measurement || ''}</span
    >`;
  }
}
