import { getDevice } from '@delegates/retrievers/device';
import { computeDomain } from '@hass/common/entity/compute_domain';
import type { HomeAssistant } from '@hass/types';
import type { Config, PetKitUnit } from '@type/config';
import { getDeviceEntities } from './card-entities';

/**
 * Get the PetKit unit information
 * @param {HomeAssistant} hass - Home Assistant instance
 * @param {Config} config - Card configuration
 * @returns {PetKitUnit | undefined} - PetKit unit information
 */
export const getPetKitUnit = (
  hass: HomeAssistant,
  config: Config,
): PetKitUnit | undefined => {
  const unit: PetKitUnit = {
    sensors: [],
    controls: [],
    diagnostics: [],
    configurations: [],
    problemEntities: [],
  };

  const device = getDevice(hass, config.device_id);
  if (!device) {
    return undefined;
  }

  unit.name = device.name || 'PetKit Device';
  unit.model = `${device.model} ${device.model_id}`;

  const entities = getDeviceEntities(hass, device.id, device.name);
  entities.forEach((entity) => {
    if (entity.category === 'diagnostic') {
      unit.diagnostics.push(entity);
    } else if (entity.category === 'config') {
      unit.configurations.push(entity);
    } else {
      // track our problem entities
      if (
        entity.attributes.device_class === 'problem' ||
        entity.translation_key === 'desiccant_left_days'
      ) {
        unit.problemEntities.push(entity);
      }

      const domain = computeDomain(entity.entity_id);
      if (['text', 'button', 'switch', 'select'].includes(domain)) {
        unit.controls.push(entity);
      } else {
        // everything else is a sensor
        unit.sensors.push(entity);
      }
    }
  });

  return unit;
};
