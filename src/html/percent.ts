import type { EntityState } from '@type/config';
import { html, type TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map';

export const percentBar = (entity: EntityState): TemplateResult => {
  // Extract the percentage value from the entity state
  const percentage = Number(entity.state);

  // Determine the color class based on percentage value
  const colorClass =
    percentage > 60 ? 'high' : percentage > 30 ? 'medium' : 'low';

  return html`
    <div class="percent-gauge">
      <div
        class="percent-gauge-fill ${colorClass}"
        style=${styleMap({
          width: `${percentage}%`,
        })}
      ></div>
    </div>
  `;
};
