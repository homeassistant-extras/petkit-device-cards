import type { DeviceRegistryEntry } from '@hass/data/device_registry';

export const isPetKit = (device: DeviceRegistryEntry) => {
  if (!device || !device.identifiers) {
    return false;
  }
  for (const parts of device.identifiers) {
    for (const part of parts) {
      if (part === 'petkit') {
        return true;
      }
    }
  }
  return false;
};
