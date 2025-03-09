import { stateActive } from '@hass/common/entity/state_active';
import type { PetKitUnit } from '@type/config';

export const hasProblem = (unit: PetKitUnit): boolean =>
  unit.problemEntities.some((entity) => stateActive(entity));
