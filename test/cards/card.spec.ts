import { PetKitDevice } from '@/cards/card';
import * as deviceRetriever from '@delegates/retrievers/device';
import * as cardEntities from '@delegates/utils/card-entities';
import * as problemUtils from '@delegates/utils/has-problem';
import * as petKitUtils from '@delegates/utils/is-petkit';
import * as domainUtils from '@hass/common/entity/compute_domain';
import type { HomeAssistant } from '@hass/types';
import * as sectionRenderer from '@html/section';
import { fixture } from '@open-wc/testing-helpers';
import { styles } from '@theme/styles';
import type { EntityState } from '@type/config';
import { expect } from 'chai';
import { html, nothing, type TemplateResult } from 'lit';
import { stub } from 'sinon';
import { version } from '../../package.json';
/**
 * Creats a fake state entity
 * @param domain
 * @param name
 * @param state
 * @param attributes
 * @returns
 */
export const s = (
  domain: string,
  name: string,
  state: string = 'on',
  attributes = {},
): EntityState => {
  return {
    entity_id: `${domain}.${name}`,
    state: state,
    attributes: attributes,
  };
};

export default () => {
  describe('card.ts', () => {
    let card: PetKitDevice;
    let mockHass: HomeAssistant;
    let consoleInfoStub: sinon.SinonStub;
    let getDeviceStub: sinon.SinonStub;
    let getDeviceEntitiesStub: sinon.SinonStub;
    let hasProblemStub: sinon.SinonStub;
    let isPetKitStub: sinon.SinonStub;
    let computeDomainStub: sinon.SinonStub;
    let renderSectionStub: sinon.SinonStub;

    beforeEach(() => {
      consoleInfoStub = stub(console, 'info');
      getDeviceStub = stub(deviceRetriever, 'getDevice');
      getDeviceEntitiesStub = stub(cardEntities, 'getDeviceEntities');
      hasProblemStub = stub(problemUtils, 'hasProblem');
      isPetKitStub = stub(petKitUtils, 'isPetKit');
      computeDomainStub = stub(domainUtils, 'computeDomain');
      renderSectionStub = stub(sectionRenderer, 'renderSection');

      card = new PetKitDevice();
      mockHass = {
        states: {
          'sensor.petkit_battery': s('sensor', 'petkit_battery', '75', {
            friendly_name: 'PetKit Battery Level',
            device_class: 'battery',
          }),
          'switch.petkit_power': s('switch', 'petkit_power', 'on', {
            friendly_name: 'PetKit Power',
          }),
          'sensor.petkit_problem': s('sensor', 'petkit_problem', 'off', {
            friendly_name: 'PetKit Problem',
            device_class: 'problem',
          }),
          'text.petkit_config': s('text', 'petkit_config', 'default', {
            friendly_name: 'PetKit Configuration',
          }),
          'sensor.petkit_diagnostic': s('sensor', 'petkit_diagnostic', 'ok', {
            friendly_name: 'PetKit Diagnostic',
          }),
        },
        devices: {
          device_1: {
            id: 'device_1',
            name: 'PetKit Feeder',
            model: 'Feeder',
            model_id: 'Plus Pro',
          },
        },
        entities: {
          'sensor.petkit_battery': {
            device_id: 'device_1',
            entity_id: 'sensor.petkit_battery',
            category: null,
          },
          'switch.petkit_power': {
            device_id: 'device_1',
            entity_id: 'switch.petkit_power',
            category: null,
          },
          'sensor.petkit_problem': {
            device_id: 'device_1',
            entity_id: 'sensor.petkit_problem',
            category: null,
          },
          'text.petkit_config': {
            device_id: 'device_1',
            entity_id: 'text.petkit_config',
            category: 'config',
          },
          'sensor.petkit_diagnostic': {
            device_id: 'device_1',
            entity_id: 'sensor.petkit_diagnostic',
            category: 'diagnostic',
          },
        },
      } as any as HomeAssistant;

      // Configure stubs
      getDeviceStub.returns(mockHass.devices.device_1);
      getDeviceEntitiesStub.returns([
        {
          entity_id: 'sensor.petkit_battery',
          attributes: { device_class: 'battery' },
          category: null,
        },
        {
          entity_id: 'switch.petkit_power',
          attributes: {},
          category: null,
        },
        {
          entity_id: 'sensor.petkit_problem',
          attributes: { device_class: 'problem' },
          category: null,
        },
        {
          entity_id: 'text.petkit_config',
          attributes: {},
          category: 'config',
        },
        {
          entity_id: 'sensor.petkit_diagnostic',
          attributes: {},
          category: 'diagnostic',
        },
      ]);
      hasProblemStub.returns(false);
      isPetKitStub.returns(true);
      computeDomainStub.callsFake((entity_id) => entity_id.split('.')[0]);
      renderSectionStub.returns(html`<div class="section">Mock Section</div>`);

      card.setConfig({ device_id: 'device_1' });
      card.hass = mockHass as HomeAssistant;
    });

    afterEach(() => {
      consoleInfoStub.restore();
      getDeviceStub.restore();
      getDeviceEntitiesStub.restore();
      hasProblemStub.restore();
      isPetKitStub.restore();
      computeDomainStub.restore();
      renderSectionStub.restore();
    });

    describe('constructor', () => {
      it('should log the version with proper formatting', () => {
        // Assert that console.info was called once
        expect(consoleInfoStub.calledOnce).to.be.true;

        // Assert that it was called with the expected arguments
        expect(
          consoleInfoStub.calledWithExactly(
            `%c🐱 Poat's Tools: petkit-device-card - ${version}`,
            'color: #CFC493;',
          ),
        ).to.be.true;
      });
    });

    describe('setConfig', () => {
      it('should set the configuration', () => {
        const config = { device_id: 'device_2' };
        card.setConfig(config);
        expect(card['_config']).to.equal(config);
      });

      it('should not update config if identical', () => {
        const config = { device_id: 'device_1' };
        const originalConfig = card['_config'];
        card.setConfig(config);
        expect(card['_config']).to.equal(originalConfig);
      });
    });

    describe('hass property setter', () => {
      it('should update unit when hass changes', () => {
        expect(card['_unit']).to.exist;
        expect(card['_unit'].name).to.equal('PetKit Feeder');
        expect(card['_unit'].model).to.equal('Feeder Plus Pro');
      });

      it('should categorize entities correctly', () => {
        expect(card['_unit'].sensors).to.have.length(2);
        expect(card['_unit'].controls).to.have.length(1);
        expect(card['_unit'].diagnostics).to.have.length(1);
        expect(card['_unit'].configurations).to.have.length(1);
        expect(card['_unit'].problemEntities).to.have.length(1);
      });

      it('should handle missing device gracefully', () => {
        getDeviceStub.returns(undefined);
        card.hass = mockHass as HomeAssistant;
        // Should not throw an error
      });

      it('should not update unit if identical', () => {
        const originalUnit = card['_unit'];
        card.hass = mockHass as HomeAssistant;
        expect(card['_unit']).to.equal(originalUnit);
      });
    });

    describe('styles', () => {
      it('should return expected styles', () => {
        const actual = PetKitDevice.styles;
        expect(actual).to.deep.equal(styles);
      });
    });

    describe('rendering', () => {
      it('should render nothing if no unit exists', () => {
        (card as any)._unit = undefined;
        const el = card.render();
        expect(el).to.equal(nothing);
      });

      it('should render ha-card with proper sections', async () => {
        const el = await fixture(card.render() as TemplateResult);
        expect(el.tagName.toLowerCase()).to.equal('ha-card');
        expect(el.querySelectorAll('.section')).to.have.length(4);
      });

      it('should add problem class when problem exists', async () => {
        hasProblemStub.returns(true);
        const el = await fixture(card.render() as TemplateResult);
        expect(el.classList.contains('problem')).to.be.true;
      });

      it('should use title from config if available', async () => {
        card.setConfig({ device_id: 'device_1', title: 'Custom Title' });
        const el = await fixture(card.render() as TemplateResult);
        const titleElement = el.querySelector('.title span');
        expect(titleElement?.textContent).to.equal('Custom Title');
      });

      it('should use device name if no title in config', async () => {
        const el = await fixture(card.render() as TemplateResult);
        const titleElement = el.querySelector('.title span');
        expect(titleElement?.textContent).to.equal('PetKit Feeder');
      });

      it('should display model information', async () => {
        const el = await fixture(card.render() as TemplateResult);
        const modelElement = el.querySelector('.model');
        expect(modelElement?.textContent).to.equal('Feeder Plus Pro');
      });

      it('should call renderSection for each entity category', () => {
        card.render();
        expect(renderSectionStub.callCount).to.equal(4);
        expect(
          renderSectionStub.calledWith(
            card,
            mockHass,
            card['_config'],
            'Controls',
          ),
        ).to.be.true;
        expect(
          renderSectionStub.calledWith(
            card,
            mockHass,
            card['_config'],
            'Configuration',
          ),
        ).to.be.true;
        expect(
          renderSectionStub.calledWith(
            card,
            mockHass,
            card['_config'],
            'Sensors',
          ),
        ).to.be.true;
        expect(
          renderSectionStub.calledWith(
            card,
            mockHass,
            card['_config'],
            'Diagnostic',
          ),
        ).to.be.true;
      });
    });

    describe('getConfigElement()', () => {
      it('should return a petkit-device-editor element', () => {
        const element = PetKitDevice.getConfigElement();
        expect(element).to.be.an('HTMLElement');
        expect(element.tagName.toLowerCase()).to.equal('petkit-device-editor');
      });

      it('should return a new element instance each time', () => {
        const element1 = PetKitDevice.getConfigElement();
        const element2 = PetKitDevice.getConfigElement();
        expect(element1).to.not.equal(element2);
      });
    });

    describe('getStubConfig()', () => {
      it('should return config with PetKit device id', async () => {
        // Reset stub to ensure it returns true for the first device
        isPetKitStub.resetBehavior();
        isPetKitStub.returns(true);

        const config = await PetKitDevice.getStubConfig(mockHass);
        expect(config).to.be.an('object');
        expect(config).to.have.property('device_id');
        expect(config.device_id).to.equal('device_1');
      });

      it('should return empty device_id if no PetKit devices found', async () => {
        isPetKitStub.resetBehavior();
        isPetKitStub.returns(false);

        const config = await PetKitDevice.getStubConfig(mockHass);
        expect(config.device_id).to.equal('');
      });
    });
  });
};
