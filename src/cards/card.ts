import { renderEntityRow } from '@/html/row';
import { getDevice } from '@delegates/retrievers/device';
import { getDeviceEntities } from '@delegates/utils/card-entities';
import { hasProblem } from '@delegates/utils/has-problem';
import { isPetKit } from '@delegates/utils/is-petkit';
import type { HomeAssistant } from '@hass/types';
import { styles } from '@theme/styles';
import type { Config, EntityInformation, PetKitUnit } from '@type/config';
import { CSSResult, html, LitElement, nothing, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
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
      problemEntities: [],
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
          // track our problem entities
          if (entity.attributes.device_class === 'problem') {
            unit.problemEntities.push(entity);
          }
          // everything else is a sensor
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
   * Renders a section with its rows
   * @param {string} title - Section title
   * @param {Array} entities - List of entities to render
   * @returns {TemplateResult} The rendered section
   */
  private _renderSection(
    title: string,
    entities: EntityInformation[],
  ): TemplateResult | typeof nothing {
    if (!entities || entities.length === 0) {
      return nothing;
    }

    return html`
      <div class="section">${title}</div>
      ${entities.map((entity) =>
        renderEntityRow(this._hass, this._unit, entity),
      )}
    `;
  }

  /**
   * renders the lit element card
   * @returns {TemplateResult} The rendered HTML template
   */
  override render(): TemplateResult | typeof nothing {
    if (!this._unit) {
      return nothing;
    }

    const problem = hasProblem(this._unit);

    return html`
      <ha-card class="${problem ? 'problem' : ''}">
        <div class="card-header">${this._config.title || this._unit.name}</div>

        ${this._renderSection('Configuration', this._unit.configurations)}
        ${this._renderSection('Sensors', this._unit.sensors)}
        ${this._renderSection('Diagnostic', this._unit.diagnostics)}
      </ha-card>
    `;
  }
}
