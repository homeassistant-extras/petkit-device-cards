import { isPetKit } from '@delegates/utils/is-petkit';
import type { DeviceRegistryEntry } from '@hass/data/device_registry';
import { expect } from 'chai';

export default () => {
  describe('is-petkit.ts', () => {
    it('should return true when device has petkit identifier', () => {
      const device: DeviceRegistryEntry = {
        id: 'device_1',
        name: 'PetKit Device',
        identifiers: [['petkit', 'device_id_123']],
        model: 'Feeder',
        area_id: 'living_room',
        model_id: 'model_id',
      };

      const result = isPetKit(device);

      expect(result).to.be.true;
    });

    it('should return true when petkit identifier is in another position', () => {
      const device: DeviceRegistryEntry = {
        id: 'device_1',
        name: 'PetKit Device',
        identifiers: [['vendor', 'petkit']],
        model: 'Feeder',
        area_id: 'living_room',
        model_id: 'model_id',
      };

      const result = isPetKit(device);

      expect(result).to.be.true;
    });

    it('should return true when petkit is in a different identifier array', () => {
      const device: DeviceRegistryEntry = {
        id: 'device_1',
        name: 'PetKit Device',
        identifiers: [
          ['vendor', 'device_id_123'],
          ['petkit', 'serial_123'],
        ],
        model: 'Feeder',
        area_id: 'living_room',
        model_id: 'model_id',
      };

      const result = isPetKit(device);

      expect(result).to.be.true;
    });

    it('should return false when device has no petkit identifier', () => {
      const device: DeviceRegistryEntry = {
        id: 'device_1',
        name: 'Other Device',
        identifiers: [['other_brand', 'device_id_123']],
        model: 'Other Model',
        area_id: 'living_room',
        model_id: 'model_id',
      };

      const result = isPetKit(device);

      expect(result).to.be.false;
    });

    it('should return false for undefined device', () => {
      const result = isPetKit(undefined as unknown as DeviceRegistryEntry);

      expect(result).to.be.false;
    });

    it('should return false for null device', () => {
      const result = isPetKit(null as unknown as DeviceRegistryEntry);

      expect(result).to.be.false;
    });

    it('should return false for device with no identifiers', () => {
      const device: DeviceRegistryEntry = {
        id: 'device_1',
        name: 'No Identifiers Device',
        model: 'Unknown',
        area_id: 'area',
        model_id: 'model_id',
        identifiers: [],
      };

      const result = isPetKit(device);

      expect(result).to.be.false;
    });

    it('should return false for device with empty identifiers array', () => {
      const device: DeviceRegistryEntry = {
        id: 'device_1',
        name: 'Empty Identifiers Device',
        identifiers: [],
        model: 'Unknown',
        model_id: 'model_id',
        area_id: 'area',
      };

      const result = isPetKit(device);

      expect(result).to.be.false;
    });

    it('should return false when petkit is a substring but not an exact match', () => {
      const device: DeviceRegistryEntry = {
        id: 'device_1',
        name: 'Not PetKit Device',
        identifiers: [['notpetkit', 'petkitlike']],
        model: 'Feeder Clone',
        area_id: 'living_room',
        model_id: 'model_id',
      };

      const result = isPetKit(device);

      expect(result).to.be.false;
    });

    it('should not be case sensitive', () => {
      // The implementation is case sensitive, this test verifies that behavior
      const device: DeviceRegistryEntry = {
        id: 'device_1',
        name: 'PetKit Device',
        identifiers: [['PETKIT', 'device_id_123']],
        model: 'Feeder',
        area_id: 'living_room',
        model_id: 'model_id',
      };

      const result = isPetKit(device);

      // Should return false as the function checks for exact 'petkit' string
      expect(result).to.be.false;
    });
  });
};
