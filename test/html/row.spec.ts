import * as stateActiveModule from '@hass/common/entity/state_active';
import type { HomeAssistant } from '@hass/types';
import * as percentBarModule from '@html/percent';
import { row } from '@html/row';
import * as stateContentModule from '@html/state-content';
import { fixture, html } from '@open-wc/testing-helpers';
import type { EntityInformation } from '@type/config';
import { expect } from 'chai';
import { stub, type SinonStub } from 'sinon';

describe('row.ts', () => {
  let mockHass: HomeAssistant;
  let mockEntity: EntityInformation;
  let stateContentStub: SinonStub;
  let percentBarStub: SinonStub;
  let stateActiveStub: SinonStub;

  beforeEach(() => {
    mockHass = {} as HomeAssistant;

    mockEntity = {
      entity_id: 'sensor.test',
      state: '50',
      translation_key: undefined,
      attributes: {
        friendly_name: 'Test Sensor',
        unit_of_measurement: '%',
        state_class: 'measurement',
      },
      config: {
        tap_action: { action: 'more-info' },
        hold_action: { action: 'more-info' },
      },
    } as EntityInformation;

    stateContentStub = stub(stateContentModule, 'stateContent').resolves(
      html`<div>Test Content</div>` as any,
    );
    percentBarStub = stub(percentBarModule, 'percentBar').returns(
      html`<div>Percent Bar</div>`,
    );
    stateActiveStub = stub(stateActiveModule, 'stateActive').returns(false);
  });

  afterEach(() => {
    stateContentStub.restore();
    percentBarStub.restore();
    stateActiveStub.restore();
  });

  it('should render row with state content', async () => {
    const result = await row(mockHass, mockEntity);
    const el = await fixture(result);

    expect(stateContentStub.calledOnce).to.be.true;
    expect(stateContentStub.firstCall.args).to.deep.equal([
      mockHass,
      mockEntity,
      undefined,
    ]);
  });

  it('should show percent bar for percentage entities', async () => {
    const result = await row(mockHass, mockEntity);
    await fixture(result);

    expect(percentBarStub.calledOnce).to.be.true;
  });

  it('should apply status-error class for active problem entities', async () => {
    stateActiveStub.returns(true);
    mockEntity.attributes.device_class = 'problem';

    const result = await row(mockHass, mockEntity);
    const el = await fixture(result);

    expect(stateActiveStub.calledOnce).to.be.true;
    expect(el.classList.contains('row')).to.be.true;
    expect(el.classList.contains('status-error')).to.be.true;
  });

  it('should apply status-ok class for inactive problem entities', async () => {
    stateActiveStub.returns(false);
    mockEntity.attributes.device_class = 'problem';

    const result = await row(mockHass, mockEntity);
    const el = await fixture(result);

    expect(el.classList.contains('row')).to.be.true;
    expect(el.classList.contains('status-ok')).to.be.true;
  });
});
