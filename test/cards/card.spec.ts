import { PetKitDevice } from '@/cards/card';
import * as problemUtils from '@delegates/utils/has-problem';
import * as petKitUtils from '@delegates/utils/is-petkit';
import * as petKitUnitUtils from '@delegates/utils/petkit-unit';
import type { HomeAssistant } from '@hass/types';
import * as petModule from '@html/pet';
import * as sectionRenderer from '@html/section';
import { fixture } from '@open-wc/testing-helpers';
import { styles } from '@theme/styles';
import type { PetKitUnit } from '@type/config';
import { expect } from 'chai';
import { html, nothing, type TemplateResult } from 'lit';
import { stub } from 'sinon';
import { version } from '../../package.json';

describe('card.ts', () => {
  let card: PetKitDevice;
  let mockHass: HomeAssistant;
  let mockUnit: PetKitUnit;
  let consoleInfoStub: sinon.SinonStub;
  let hasProblemStub: sinon.SinonStub;
  let isPetKitStub: sinon.SinonStub;
  let getPetKitUnitStub: sinon.SinonStub;
  let renderSectionStub: sinon.SinonStub;

  beforeEach(() => {
    consoleInfoStub = stub(console, 'info');
    hasProblemStub = stub(problemUtils, 'hasProblem');
    isPetKitStub = stub(petKitUtils, 'isPetKit');
    getPetKitUnitStub = stub(petKitUnitUtils, 'getPetKitUnit');
    renderSectionStub = stub(sectionRenderer, 'renderSection');

    card = new PetKitDevice();
    mockHass = {
      devices: {
        device_1: {
          id: 'device_1',
          name: 'PetKit Feeder',
          model: 'Feeder',
          model_id: 'Plus Pro',
        },
      },
    } as any as HomeAssistant;

    // Create mock PetKit unit
    mockUnit = {
      name: 'PetKit Feeder',
      model: 'Feeder Plus Pro',
      sensors: [
        {
          entity_id: 'sensor.petkit_battery',
          category: undefined,
          translation_key: undefined,
          state: '75',
          attributes: { device_class: 'battery' },
        },
      ],
      controls: [
        {
          entity_id: 'switch.petkit_power',
          category: undefined,
          translation_key: undefined,
          state: 'on',
          attributes: {},
        },
      ],
      diagnostics: [
        {
          entity_id: 'sensor.petkit_diagnostic',
          category: 'diagnostic',
          translation_key: undefined,
          state: 'ok',
          attributes: {},
        },
      ],
      configurations: [
        {
          entity_id: 'text.petkit_config',
          category: 'config',
          translation_key: undefined,
          state: 'default',
          attributes: {},
        },
      ],
      problemEntities: [
        {
          entity_id: 'sensor.petkit_problem',
          category: undefined,
          translation_key: undefined,
          state: 'off',
          attributes: { device_class: 'problem' },
        },
      ],
    };

    // Configure stubs
    hasProblemStub.returns(false);
    isPetKitStub.returns(true);
    getPetKitUnitStub.returns(mockUnit);
    renderSectionStub.returns(html`<div class="section">Mock Section</div>`);

    card.setConfig({ device_id: 'device_1' });
    card.hass = mockHass as HomeAssistant;
  });

  afterEach(() => {
    consoleInfoStub.restore();
    hasProblemStub.restore();
    isPetKitStub.restore();
    getPetKitUnitStub.restore();
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
    it('should call getPetKitUnit with hass and config', () => {
      card.hass = mockHass as HomeAssistant;
      expect(getPetKitUnitStub.calledWith(mockHass, card['_config'])).to.be
        .true;
    });

    it('should update unit when getPetKitUnit returns a new value', () => {
      const newUnit = { ...mockUnit, name: 'Updated Device' };
      getPetKitUnitStub.returns(newUnit);
      card.hass = mockHass as HomeAssistant;
      expect(card['_unit']).to.equal(newUnit);
    });

    it('should not update unit if getPetKitUnit returns identical data', () => {
      // First call to set initial unit
      card.hass = mockHass as HomeAssistant;
      const originalUnit = card['_unit'];

      // Second call should not update unit since it's identical
      card.hass = mockHass as HomeAssistant;
      expect(card['_unit']).to.equal(originalUnit);
    });

    it('should not update unit if getPetKitUnit returns undefined', () => {
      // First set a valid unit
      card.hass = mockHass as HomeAssistant;
      const originalUnit = card['_unit'];

      // Then test with undefined return value
      getPetKitUnitStub.returns(undefined);
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

    it('should render pet component when model is Pet PET and cute_lil_kitty feature is enabled', () => {
      // Setup mock for pet function
      const petStub = stub(petModule, 'pet');
      petStub.returns(html`<div class="mock-pet">Pet Component</div>`);

      // Configure the card with the cute_lil_kitty feature
      card.setConfig({
        device_id: 'device_1',
        features: ['cute_lil_kitty'],
      });

      // Set up the unit with Pet PET model
      (card as any)._unit = {
        ...card['_unit'],
        model: 'Pet PET',
      };

      // Render the card
      const result = card.render();

      // Check that pet() was called with the correct unit
      expect(petStub.calledOnce).to.be.true;
      expect(petStub.calledWith(card['_unit'])).to.be.true;

      // Check that the result of pet() was returned
      expect(result).to.not.equal(nothing);

      // Restore the stub
      petStub.restore();
    });

    // Add another test to verify the normal path
    it('should not render pet component when model is Pet PET but cute_lil_kitty feature is not enabled', () => {
      // Setup mock for pet function
      const petStub = stub(petModule, 'pet');

      // Configure the card without the cute_lil_kitty feature
      card.setConfig({
        device_id: 'device_1',
        features: [],
      });

      // Set up the unit with Pet PET model
      (card as any)._unit = {
        ...card['_unit'],
        model: 'Pet PET',
      };

      // Render the card
      card.render();

      // Check that pet() was not called
      expect(petStub.notCalled).to.be.true;

      // Restore the stub
      petStub.restore();
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
