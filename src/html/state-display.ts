import type { HomeAssistant } from '@hass/types';
import type { EntityState } from '@type/config';
import { html, type TemplateResult } from 'lit';

export const stateDisplay = (
  hass: HomeAssistant,
  entity: EntityState,
  className: string,
): TemplateResult =>
  html`<state-display
    .hass=${hass}
    .stateObj=${entity}
    class="${className}"
  ></state-display>`;
