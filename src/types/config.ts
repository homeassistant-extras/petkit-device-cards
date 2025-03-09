/**
 * @file Card Configuration TypeScript type definitions
 * @description Core type definitions for card configuration.
 */

import type { EntityCategory } from '@hass/data/entity_registry';

/**
 * Configuration settings for entity display and behavior within Home Assistant.
 */
export interface Config {
  /** Unique identifier for the device */
  device_id: string;

  /** Optional display title for the device */
  title?: string;
}

/**
 * Represents the states of various sensors in a Z-Wave device
 */
export interface PetKitUnit {
  /** The name of the device */
  name?: string;

  /** The sensors of the device */
  sensors: EntityState[];

  /** The diagnostics of the device */
  diagnostics: EntityState[];

  /** The configurations of the device */
  configurations: EntityState[];
}

export interface EntityState {
  /** ID of the entity this state belongs to */
  entity_id: string;

  /** Current state value as a string (e.g., "on", "off", "25.5") */
  state: string;

  /** Optional category of the entity */
  category?: EntityCategory;

  /** Additional attributes associated with the state */
  attributes: Record<string, any>;
}
