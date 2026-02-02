import type { PetKitDevice } from '@cards/card';
import type { HomeAssistant } from '@hass/types';
import type { Config, EntityInformation } from '@type/config';
import { html, nothing, type TemplateResult } from 'lit';
import { row } from './row';

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
    ${displayEntities.map((entity) => row(hass, entity, element))}
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
