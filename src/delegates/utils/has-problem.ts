import { stateActive } from '@hass/common/entity/state_active';
import type { PetKitUnit } from '@type/config';

export const hasProblem = (unit: PetKitUnit): boolean =>
  unit
    ? unit.problemEntities.some((entity) => {
        if (entity.translation_key === 'desiccant_left_days') {
          return entity.state === '0';
        }
        return stateActive(entity);
      })
    : false;
