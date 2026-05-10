import '@cards/components/row/row';
import type { HomeAssistant } from '@hass/types';
import type { Config, EntityInformation } from '@type/config';
import { html, nothing, type TemplateResult } from 'lit';

/**
 * Renders a collapsible block of entity rows. Section open/closed state is owned
 * by the caller ({@link PetKitDeviceSection}); attribute expansion is per row.
 */
export const renderSection = (
  hass: HomeAssistant,
  config: Config,
  title: string,
  entities: EntityInformation[],
  sectionExpanded: boolean,
  onToggleSection: () => void,
): TemplateResult | typeof nothing => {
  if (!entities || entities.length === 0) {
    return nothing;
  }

  const size = config.preview_count || 3;
  const needsExpansion = entities.length > size;
  const displayEntities =
    needsExpansion && !sectionExpanded ? entities.slice(0, size) : entities;

  const rowTemplates = displayEntities.map(
    (entity) =>
      html`<petkit-device-row
        .hass=${hass}
        .config=${config}
        .entity=${entity}
      ></petkit-device-row>`,
  );

  const sectionClass = `section ${sectionExpanded ? 'expanded' : ''} ${!needsExpansion ? 'few-items' : ''}`;

  return html`<div class="${sectionClass}">
    <div class="section-header">
      <div class="section-title">${title}</div>
      ${needsExpansion
        ? html`<div
            class="section-chevron ${sectionExpanded ? 'expanded' : ''}"
            @click=${(e: Event) => {
              e.preventDefault();
              onToggleSection();
            }}
          >
            <ha-icon
              icon="mdi:chevron-${sectionExpanded ? 'up' : 'down'}"
            ></ha-icon>
          </div>`
        : nothing}
    </div>
    ${rowTemplates}
    ${needsExpansion
      ? html`<div class="section-footer">
          ${sectionExpanded
            ? nothing
            : html`
                <div
                  class="show-more"
                  @click=${(e: Event) => {
                    e.preventDefault();
                    onToggleSection();
                  }}
                >
                  Show ${entities.length - size} more...
                </div>
              `}
        </div>`
      : nothing}
  </div>`;
};
