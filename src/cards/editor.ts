import { fireEvent } from '@hass/common/dom/fire_event';
import type { HaFormSchema } from '@hass/components/ha-form/types';
import type { HomeAssistant } from '@hass/types';
import type { Config } from '@type/config';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';

/**
 * Common interactions schema used in petkit device card
 * Defines the configuration options for tap, hold, and double tap actions
 * that control card behavior when users interact with it
 */
const INTERACTIONS_SCHEMA: HaFormSchema = {
  name: 'interactions',
  label: 'Interactions',
  type: 'expandable',
  flatten: true,
  icon: 'mdi:gesture-tap',
  schema: [
    {
      name: 'tap_action',
      label: 'Tap Action',
      selector: {
        ui_action: {},
      },
    },
    {
      name: 'hold_action',
      label: 'Hold Action',
      selector: {
        ui_action: {},
      },
    },
    {
      name: 'double_tap_action',
      label: 'Double Tap Action',
      selector: {
        ui_action: {},
      },
    },
  ],
};

const SCHEMA: HaFormSchema[] = [
  {
    name: 'device_id',
    selector: {
      device: {
        filter: {
          integration: 'petkit',
        },
      },
    },
    required: true,
    label: `PetKit Device`,
  },
  {
    name: 'title',
    required: false,
    label: 'Card Title',
    selector: {
      text: {},
    },
  },
  {
    name: 'preview_count',
    required: false,
    label: 'Preview Count',
    selector: {
      text: {
        type: 'number' as const,
      },
    },
  },
  {
    name: 'features',
    label: 'Features',
    required: false,
    selector: {
      select: {
        multiple: true,
        mode: 'list' as const,
        options: [
          {
            label: 'Use Pet Portrait',
            value: 'cute_lil_kitty',
          },
        ],
      },
    },
  },
  INTERACTIONS_SCHEMA,
];

export class PetKitDeviceEditor extends LitElement {
  /**
   * Card configuration object
   */
  @state()
  private _config!: Config;

  /**
   * Home Assistant instance
   * Not marked as @state as it's handled differently
   */
  public hass!: HomeAssistant;

  /**
   * renders the lit element card
   * @returns {TemplateResult} The rendered HTML template
   */
  override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) {
      return nothing;
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${(s: HaFormSchema) => s.label}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  /**
   * Sets up the card configuration
   * @param {Config} config - The card configuration
   */
  setConfig(config: Config) {
    this._config = config;
  }

  private _valueChanged(ev: CustomEvent) {
    const config = ev.detail.value as Config;
    if (!config.features?.length) {
      delete config.features;
    }

    // @ts-ignore
    fireEvent(this, 'config-changed', {
      config,
    });
  }
}
