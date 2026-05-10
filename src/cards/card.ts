import '@cards/components/section/section';
import { hasProblem } from '@delegates/utils/has-problem';
import { isPetKit } from '@delegates/utils/is-petkit';
import { getPetKitUnit } from '@delegates/utils/petkit-unit';
import type { HomeAssistant } from '@hass/types';
import { pet } from '@html/pet';
import { styles } from '@theme/styles';
import type { Config, PetKitUnit } from '@type/config';
import { CSSResult, html, LitElement, nothing, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
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

    const unit = getPetKitUnit(hass, this._config);

    if (unit && !equal(unit, this._unit)) {
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

    if (
      this._unit.model?.includes('PET') &&
      this._config.features?.includes('cute_lil_kitty')
    ) {
      return pet(this._unit);
    }

    const problem = hasProblem(this._unit);
    const { _hass: hass, _config: config, _unit: unit } = this;

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

        <petkit-device-section
          .hass=${hass}
          .config=${config}
          .sectionTitle=${'Controls'}
          .entities=${unit.controls}
        ></petkit-device-section>
        <petkit-device-section
          .hass=${hass}
          .config=${config}
          .sectionTitle=${'Configuration'}
          .entities=${unit.configurations}
        ></petkit-device-section>
        <petkit-device-section
          .hass=${hass}
          .config=${config}
          .sectionTitle=${'Sensors'}
          .entities=${unit.sensors}
        ></petkit-device-section>
        <petkit-device-section
          .hass=${hass}
          .config=${config}
          .sectionTitle=${'Diagnostic'}
          .entities=${unit.diagnostics}
        ></petkit-device-section>
      </ha-card>
    `;
  }
}
