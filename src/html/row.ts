/**
 * @file row.ts
 * @description Entity row rendering for the petkit device card
 * This file handles the rendering of individual entity rows within the device card,
 * including their state content, percentage bars, and expandable attribute details.
 */

import { stateActive } from '@hass/common/entity/state_active';
import type { HomeAssistant } from '@hass/types';
import type { EntityInformation } from '@type/config';
import { html, nothing, type TemplateResult } from 'lit';
import { percentBar } from './percent';
import { stateContent } from './state-content';

/**
 * Renders a single entity row with appropriate styling and components
 *
 * @param {HomeAssistant} hass - The Home Assistant instance
 * @param {EntityInformation} entity - The entity to render
 * @returns {Promise<TemplateResult>} A lit-html template for the entity row
 */
export const row = async (
  hass: HomeAssistant,
  entity: EntityInformation,
): Promise<TemplateResult> => {
  let statusClassName: string | undefined;

  // Determine status class based on problem state
  if (entity.attributes.device_class === 'problem') {
    // Add color to problem class based on state
    const active = stateActive(entity);
    statusClassName = active ? 'status-error' : 'status-ok';
  }

  // Determine if we should show a percentage bar
  const showBar =
    (entity.attributes.state_class === 'measurement' &&
      entity.attributes.unit_of_measurement === '%') ||
    entity.translation_key === 'desiccant_left_days';

  const stateContentResult = await stateContent(hass, entity, statusClassName);

  const rowClass = statusClassName ? `row ${statusClassName}` : 'row';

  return html`<div class="${rowClass}">
    <div class="row-content">
      ${stateContentResult} ${showBar ? percentBar(entity) : nothing}
    </div>
  </div>`;
};
