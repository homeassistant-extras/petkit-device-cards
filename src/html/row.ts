import { stateActive } from '@hass/common/entity/state_active';
import type { HomeAssistant } from '@hass/types';
import type { EntityInformation, PetKitUnit } from '@type/config';
import { type TemplateResult, html } from 'lit';
import { percentBar } from './percent';
import { stateDisplay } from './state-display';

const customRender = (entity: EntityInformation) => {
  let className = '';
  let customTemplate = undefined;

  if (entity.attributes.device_class === 'problem') {
    // add color to problem class based on state
    const active = stateActive(entity);
    className = active ? 'status-error' : 'status-ok';
  } else if (
    entity.attributes.state_class === 'measurement' &&
    entity.attributes.unit_of_measurement === '%'
  ) {
    // percent bar for battery and filter like entities
    customTemplate = percentBar(entity);
  }
  return { customTemplate, className };
};

/**
 * Renders a single entity row
 * @param {object} entity - The entity to render
 * @returns {TemplateResult} The rendered row
 */
export const renderEntityRow = (
  hass: HomeAssistant,
  unit: PetKitUnit,
  entity: EntityInformation,
): TemplateResult => {
  let { customTemplate, className } = customRender(entity);
  const label = (entity.attributes.friendly_name || entity.name || '').replace(
    unit.name,
    '',
  );

  return html`
    <div class="row">
      <div class="label">
        <ha-state-icon .hass=${hass} .stateObj=${entity}></ha-state-icon>
        <span>${label}</span>
      </div>
      <div class="value">
        ${customTemplate || stateDisplay(hass, entity, className)}
      </div>
    </div>
  `;
};
