import { getDevice } from '@delegates/retrievers/device';
import { getDeviceEntities } from '@delegates/utils/card-entities';
import { hasProblem } from '@delegates/utils/has-problem';
import { isPetKit } from '@delegates/utils/is-petkit';
import { computeDomain } from '@hass/common/entity/compute_domain';
import type { HomeAssistant } from '@hass/types';
import { renderSection } from '@html/section';
import { styles } from '@theme/styles';
import type { Config, PetKitUnit } from '@type/config';
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

  /**
   * Track expanded state of sections
   */
  @state()
  public expandedSections: Record<string, boolean> = {};

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
      controls: [],
      diagnostics: [],
      configurations: [],
      problemEntities: [],
    };

    const device = getDevice(hass, this._config.device_id);
    if (!device) {
      return;
    }

    unit.name = device.name || 'PetKit Device';
    unit.model = `${device.model} ${device.model_id}`;

    const entities = getDeviceEntities(hass, device.id, device.name);
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

          const domain = computeDomain(entity.entity_id);
          if (['text', 'button', 'switch', 'select'].includes(domain)) {
            unit.controls.push(entity);
          } else {
            // everything else is a sensor
            unit.sensors.push(entity);
          }
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
        <div class="card-header">
          <div class="title">
            <span>${this._config.title || this._unit.name}</span>
            <span class="model">${this._unit.model}</span>
          </div>
          <img
            class="logo"
            src="https://brands.home-assistant.io/petkit/dark_icon.png"
          />
        </div>

        ${renderSection(
          this,
          this._hass,
          this._config,
          'Controls',
          this._unit.controls,
        )}
        ${renderSection(
          this,
          this._hass,
          this._config,
          'Configuration',
          this._unit.configurations,
        )}
        ${renderSection(
          this,
          this._hass,
          this._config,
          'Sensors',
          this._unit.sensors,
        )}
        ${renderSection(
          this,
          this._hass,
          this._config,
          'Diagnostic',
          this._unit.diagnostics,
        )}
      </ha-card>
    `;
  }
}
