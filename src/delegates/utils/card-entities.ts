import { getState } from '@delegates/retrievers/state';
import type { HomeAssistant } from '@hass/types';
import type { Config, EntityInformation } from '@type/config';

export const getDeviceEntities = (
  hass: HomeAssistant,
  config: Config,
  deviceId: string,
  deviceName: string | null,
): EntityInformation[] => {
  const deviceEntities = Object.values(hass.entities)
    .filter((entity) => entity.device_id === deviceId)
    .map((entity) => {
      const state = getState(hass, entity.entity_id);
      if (state === undefined) {
        return;
      }

      // convenience
      const name = state.attributes.friendly_name.replace(deviceName, '');
      return {
        entity_id: entity.entity_id,
        category: entity.entity_category,
        state: state.state,
        translation_key: entity.translation_key,
        attributes: {
          ...state.attributes,
          friendly_name: name,
        },
        config: {
          tap_action: config.tap_action || { action: 'more-info' },
          hold_action: config.hold_action || { action: 'more-info' },
          double_tap_action: config.double_tap_action,
        },
      };
    })
    .filter((e) => e !== undefined);
  return deviceEntities;
};
