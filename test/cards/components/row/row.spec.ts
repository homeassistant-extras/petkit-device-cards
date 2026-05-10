import * as cardHelpersModule from '@helpers/card-helpers';
import { PetKitDeviceRow } from '@cards/components/row/row';
import type { HomeAssistant } from '@hass/types';
import * as percentBarModule from '@html/percent';
import * as stateContentModule from '@html/state-content';
import { fixture } from '@open-wc/testing-helpers';
import type { Config, EntityInformation } from '@type/config';
import type { CardHelpers } from '@type/lovelace';
import { expect } from 'chai';
import { html, nothing, type TemplateResult } from 'lit';
import { stub } from 'sinon';

describe('petkit-device-row.ts', () => {
  let el: PetKitDeviceRow;
  let hass: HomeAssistant;
  let config: Config;
  let entity: EntityInformation;

  let resolvePoatCardHelpersStub: sinon.SinonStub;
  let stateContentStub: sinon.SinonStub;
  let percentBarStub: sinon.SinonStub;

  beforeEach(() => {
    resolvePoatCardHelpersStub = stub(
      cardHelpersModule,
      'resolvePoatCardHelpers',
    );

    stateContentStub = stub(stateContentModule, 'stateContent');
    stateContentStub.returns(html`<div class="mocked-state-content"></div>`);

    percentBarStub = stub(percentBarModule, 'percentBar');
    percentBarStub.returns(html`<div class="mocked-percent-bar"></div>`);

    hass = {} as HomeAssistant;
    config = { device_id: 'device_1' } as Config;
    entity = {
      entity_id: 'sensor.test',
      state: '75',
      translation_key: undefined,
      attributes: { unit_of_measurement: '%' },
      name: 'Test',
      isActive: false,
      isProblemEntity: false,
    } as EntityInformation;

    el = new PetKitDeviceRow();
    el.hass = hass;
    el.config = config;
    el.entity = entity;
  });

  afterEach(() => {
    resolvePoatCardHelpersStub.restore();
    stateContentStub.restore();
    percentBarStub.restore();
    cardHelpersModule.resetPoatCardHelpersForTests();
  });

  describe('connectedCallback', () => {
    it('should resolve and store card helpers', async () => {
      (el as any)._cardHelpers = undefined;
      const helpers = {} as CardHelpers;
      resolvePoatCardHelpersStub.resolves(helpers);
      (globalThis as any).loadCardHelpers = () => Promise.resolve(helpers);

      (el as any).createRenderRoot = () => document.createElement('div');
      el.connectedCallback();
      await Promise.resolve();

      expect(resolvePoatCardHelpersStub.calledOnce).to.be.true;
      expect((el as any)._cardHelpers).to.equal(helpers);
    });
  });

  describe('render()', () => {
    it('should render nothing if card helpers are not resolved yet', () => {
      (el as any)._cardHelpers = undefined;
      expect(el.render()).to.equal(nothing);
    });

    it('should render row content and percent bar', async () => {
      (el as any)._cardHelpers = {} as CardHelpers;
      const root = await fixture(el.render() as TemplateResult);

      expect(root.classList.contains('row')).to.be.true;
      expect(root.querySelector('.row-content')).to.exist;
      expect(stateContentStub.calledOnce).to.be.true;
      expect(percentBarStub.calledOnce).to.be.true;
    });

    it('should render a percentage bar for entities with % unit variations like "% available"', async () => {
      (el as any)._cardHelpers = {} as CardHelpers;
      el.entity = {
        ...entity,
        attributes: {
          ...entity.attributes,
          unit_of_measurement: '% available',
        },
      };

      await fixture(el.render() as TemplateResult);

      expect(percentBarStub.calledOnce).to.be.true;
      expect(percentBarStub.firstCall.args[0]).to.equal(el.entity);
    });

    it('should not render a percentage bar for non-percentage entities', async () => {
      (el as any)._cardHelpers = {} as CardHelpers;
      el.entity = {
        ...entity,
        attributes: { ...entity.attributes, unit_of_measurement: '°C' },
      };

      await fixture(el.render() as TemplateResult);

      expect(percentBarStub.called).to.be.false;
    });

    it('should not render a percentage bar for entities with % unit but non-numeric state', async () => {
      (el as any)._cardHelpers = {} as CardHelpers;
      el.entity = {
        ...entity,
        state: 'unknown',
        attributes: { ...entity.attributes, unit_of_measurement: '%' },
      };

      await fixture(el.render() as TemplateResult);

      expect(percentBarStub.called).to.be.false;
    });

    it('should render a percentage bar for desiccant_left_days without % unit', async () => {
      (el as any)._cardHelpers = {} as CardHelpers;
      el.entity = {
        ...entity,
        state: '15',
        translation_key: 'desiccant_left_days',
        attributes: { ...entity.attributes, unit_of_measurement: 'd' },
      };

      await fixture(el.render() as TemplateResult);

      expect(percentBarStub.calledOnce).to.be.true;
      expect(percentBarStub.firstCall.args[0]).to.equal(el.entity);
    });

    it('should apply status-error class when problem entity is active', async () => {
      (el as any)._cardHelpers = {} as CardHelpers;
      el.entity = {
        ...entity,
        attributes: {
          ...entity.attributes,
          device_class: 'problem',
        },
        state: 'problem',
      };

      const root = await fixture(el.render() as TemplateResult);

      expect(root.classList.contains('status-error')).to.be.true;
      expect(stateContentStub.calledOnce).to.be.true;
      expect(stateContentStub.firstCall.args[2]).to.equal('status-error');
    });

    it('should apply status-ok class when problem entity is inactive', async () => {
      (el as any)._cardHelpers = {} as CardHelpers;
      el.entity = {
        ...entity,
        attributes: {
          ...entity.attributes,
          device_class: 'problem',
        },
        state: 'off',
      };

      const root = await fixture(el.render() as TemplateResult);

      expect(root.classList.contains('status-ok')).to.be.true;
      expect(stateContentStub.calledOnce).to.be.true;
      expect(stateContentStub.firstCall.args[2]).to.equal('status-ok');
    });
  });
});
