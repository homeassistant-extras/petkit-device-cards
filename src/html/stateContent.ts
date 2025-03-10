import type { HomeAssistant } from '@hass/types';
import type { EntityInformation } from '@type/config';
import { html } from 'lit';

export const stateContent = (
  hass: HomeAssistant,
  entity: EntityInformation,
  className: string | undefined,
) =>
  html`<state-card-content
    .hass=${hass}
    .stateObj=${entity}
    class="${className}"
  ></state-card-content>`;
