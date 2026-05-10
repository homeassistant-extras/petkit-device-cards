import type { HomeAssistant } from '@hass/types';
import type { Config } from '@type/config';
import type { LitElement } from 'lit';

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Provides non-decorated `hass` and `config` fields.
 *
 * These are intentionally NOT `@property()` to avoid Lit reactive property
 * plumbing/attribute semantics.
 */
export const HassConfigMixin = <T extends Constructor<LitElement>>(
  superClass: T,
) => {
  class HassConfigClass extends superClass {
    public hass!: HomeAssistant;
    public config!: Config;
  }

  return HassConfigClass;
};
