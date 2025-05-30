import type { PetKitDevice } from '@cards/card';
import { stateActive } from '@hass/common/entity/state_active';
import type { HomeAssistant } from '@hass/types';
import type { Config, EntityInformation } from '@type/config';
import { html, nothing, type TemplateResult } from 'lit';
import { percentBar } from './percent';
import { stateContent } from './state-content';

/**
 * Toggles the expanded state of a section
 * @param {string} sectionTitle - The title of the section to toggle
 * @param {Event} e - The click event
 */
const toggleSection = (
  element: PetKitDevice,
  sectionTitle: string,
  e: Event,
) => {
  const expandedSections = element.expandedSections;

  element.expandedSections = {
    ...expandedSections,
    [sectionTitle]: !expandedSections[sectionTitle],
  };
};

export const renderSection = (
  element: PetKitDevice,
  hass: HomeAssistant,
  config: Config,
  title: string,
  entities: EntityInformation[],
): TemplateResult | typeof nothing => {
  if (!entities || entities.length === 0) {
    return nothing;
  }

  const size = config.preview_count || 3;
  const needsExpansion = entities.length > size;
  const isExpanded = element.expandedSections[title] || false;
  const displayEntities =
    needsExpansion && !isExpanded ? entities.slice(0, size) : entities;

  // Determine section class based on expanded state and number of items
  const sectionClass = `section ${isExpanded ? 'expanded' : ''} ${!needsExpansion ? 'few-items' : ''}`;

  return html`<div class="${sectionClass}">
    <div class="section-header">
      <div class="section-title">${title}</div>
      ${needsExpansion
        ? html`<div
            class="section-chevron ${isExpanded ? 'expanded' : ''}"
            @click=${(e: Event) => toggleSection(element, title, e)}
          >
            <ha-icon icon="mdi:chevron-${isExpanded ? 'up' : 'down'}"></ha-icon>
          </div>`
        : nothing}
    </div>
    ${displayEntities.map((entity) => {
      let className: string | undefined;

      if (entity.attributes.device_class === 'problem') {
        // add color to problem class based on state
        const active = stateActive(entity);
        className = active ? 'status-error' : 'status-ok';
      }

      const showBar =
        (entity.attributes.state_class === 'measurement' &&
          entity.attributes.unit_of_measurement === '%') ||
        entity.translation_key === 'desiccant_left_days';

      return html`<div class="row">
        ${stateContent(hass, entity, className)}
        ${showBar ? percentBar(entity) : nothing}
      </div>`;
    })}
    ${needsExpansion
      ? html`<div class="section-footer">
          ${isExpanded
            ? nothing
            : html`
                <div
                  class="show-more"
                  @click=${(e: Event) => toggleSection(element, title, e)}
                >
                  Show ${entities.length - size} more...
                </div>
              `}
        </div>`
      : nothing}
  </div>`;
};
