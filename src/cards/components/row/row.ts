import { HassConfigMixin } from '@cards/mixins/hass-config-mixin';
import { stateActive } from '@hass/common/entity/state_active';
import { resolvePoatCardHelpers } from '@helpers/card-helpers';
import { percentBar } from '@html/percent';
import { stateContent } from '@html/state-content';
import type { EntityInformation } from '@type/config';
import type { CardHelpers } from '@type/lovelace';
import { CSSResult, LitElement, html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styles } from './styles';

/**
 * PetKit counterpart to device-card’s `device-card-row`: entity row with percent bar,
 * expandable attributes (via `ll-custom`), and HA row via {@link stateContent}.
 *
 * Uses tag `petkit-device-row` so it does not collide with `device-card-row` from the other card bundle.
 */
@customElement('petkit-device-row')
export class PetKitDeviceRow extends HassConfigMixin(LitElement) {
  @property({ attribute: false })
  public entity!: EntityInformation;

  /** Resolved once from {@link globalThis.loadCardHelpers}; triggers re-render when set. */
  @state()
  private _cardHelpers?: CardHelpers;

  override connectedCallback(): void {
    super.connectedCallback();

    void resolvePoatCardHelpers(globalThis.loadCardHelpers).then((helpers) => {
      this._cardHelpers = helpers;
    });
  }

  static override get styles(): CSSResult {
    return styles;
  }

  override render(): TemplateResult | typeof nothing {
    console.log('render - row');
    if (!this._cardHelpers) {
      console.log('render - row - no card helpers');
      return nothing;
    }

    let statusClassName: string | undefined;

    // Determine status class based on problem state
    if (this.entity.attributes.device_class === 'problem') {
      // Add color to problem class based on state
      const active = stateActive(this.entity);
      statusClassName = active ? 'status-error' : 'status-ok';
    }

    const showBar =
      (this.entity.attributes.unit_of_measurement?.includes('%') &&
        !Number.isNaN(Number(this.entity.state))) ||
      this.entity.translation_key === 'desiccant_left_days';

    return html`<div class="${['row', statusClassName].join(' ')}">
      <div class="row-content">
        ${stateContent(this.hass, this.entity, statusClassName)}
        ${showBar ? percentBar(this.entity) : nothing}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'petkit-device-row': PetKitDeviceRow;
  }
}
