import { getState } from '@delegates/retrievers/state';
import type { HomeAssistant } from '@hass/types';
import type { EntityState } from '@type/config';

export const getDeviceEntities = (
  hass: HomeAssistant,
  deviceId: string,
): EntityState[] => {
  const deviceEntities = Object.values(hass.entities)
    .filter((entity) => entity.device_id === deviceId)
    .map((entity) => {
      const state = getState(hass, entity.entity_id);
      if (state === undefined) {
        return;
      }
      return {
        entity_id: entity.entity_id,
        category: entity.entity_category,
        state: state.state,
        attributes: state.attributes,
      } as EntityState;
    })
    .filter((e) => e !== undefined) as EntityState[];
  return deviceEntities;
};
