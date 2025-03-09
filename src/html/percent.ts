import type { EntityState } from '@type/config';
import { html, type TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map';

export const percentBar = (state: EntityState): TemplateResult => {
  const percentage = Number(state.state);
  const color =
    percentage > 60
      ? 'var(--success-color)'
      : percentage > 30
        ? 'var(--warning-color)'
        : 'var(--error-color)';

  return html`
    <div class="filter-percentage">
      <div
        class="filter-fill"
        style=${styleMap({
          width: `${percentage}%`,
          backgroundColor: color,
        })}
      ></div>
    </div>
    <span>${state.state}${state.attributes.unit_of_measurement || '%'}</span>
  `;
};
