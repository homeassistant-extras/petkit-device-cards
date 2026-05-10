import type { HomeAssistant } from '@hass/types';
import { resetPoatCardHelpersForTests } from '@helpers/card-helpers';
import { renderSection } from '@html/section';
import { fixture } from '@open-wc/testing-helpers';
import type { Config, EntityInformation, EntityState } from '@type/config';
import { expect } from 'chai';
import { nothing, type TemplateResult } from 'lit';

describe('section.ts', () => {
  let mockHass: HomeAssistant;
  let mockConfig: Config;
  let mockEntities: EntityInformation[];
  let mockEntityStates: Record<string, EntityState>;

  beforeEach(() => {
    mockEntityStates = {
      'sensor.test_percentage': {
        entity_id: 'sensor.test_percentage',
        state: '50',
        attributes: {
          friendly_name: 'Test Percentage',
          state_class: 'measurement',
          unit_of_measurement: '%',
        },
      },
      'sensor.desiccant_left': {
        entity_id: 'sensor.desiccant_left',
        state: '15',
        attributes: {
          friendly_name: 'Desiccant Left',
        },
      },
      'light.test_light': {
        entity_id: 'light.test_light',
        state: 'on',
        attributes: {
          friendly_name: 'Test Light',
        },
      },
      'binary_sensor.problem': {
        entity_id: 'binary_sensor.problem',
        state: 'on',
        attributes: {
          friendly_name: 'Problem Sensor',
          device_class: 'problem',
        },
      },
    };

    mockEntities = [
      {
        entity_id: 'sensor.test_percentage',
        state: '50',
        translation_key: undefined,
        attributes: {
          friendly_name: 'Test Percentage',
          state_class: 'measurement',
          unit_of_measurement: '%',
        },
      } as any as EntityInformation,
      {
        entity_id: 'sensor.desiccant_left',
        state: '15',
        translation_key: 'desiccant_left_days',
        attributes: {
          friendly_name: 'Desiccant Left',
        },
      } as any as EntityInformation,
      {
        entity_id: 'light.test_light',
        state: 'on',
        translation_key: undefined,
        attributes: {
          friendly_name: 'Test Light',
        },
      } as any as EntityInformation,
      {
        entity_id: 'binary_sensor.problem',
        state: 'on',
        translation_key: undefined,
        attributes: {
          friendly_name: 'Problem Sensor',
          device_class: 'problem',
        },
      } as any as EntityInformation,
    ];

    mockHass = {
      states: mockEntityStates,
    } as any as HomeAssistant;

    mockConfig = {
      preview_count: 5,
    } as Config;
  });

  afterEach(() => {
    resetPoatCardHelpersForTests();
  });

  const noop = () => {
    /* stub toggle */
  };

  it('should return nothing when entities array is empty', async () => {
    const result = renderSection(
      mockHass,
      mockConfig,
      'Test Section',
      [],
      false,
      noop,
    );
    expect(result).to.equal(nothing);
  });

  it('should return nothing when entities is undefined', async () => {
    const result = renderSection(
      mockHass,
      mockConfig,
      'Test Section',
      undefined as any,
      false,
      noop,
    );
    expect(result).to.equal(nothing);
  });

  it('should render section with correct title', async () => {
    const sectionTitle = 'Test Section';
    const result = renderSection(
      mockHass,
      mockConfig,
      sectionTitle,
      mockEntities,
      false,
      noop,
    );
    const el = await fixture(result as TemplateResult);

    const titleElement = el.querySelector('.section-title');
    expect(titleElement?.textContent).to.equal(sectionTitle);
  });

  it('should apply "few-items" class when there are fewer entities than preview count', async () => {
    mockConfig.preview_count = 5;
    const result = renderSection(
      mockHass,
      mockConfig,
      'Test Section',
      mockEntities,
      false,
      noop,
    );
    const el = await fixture(result as TemplateResult);

    expect(el.classList.contains('few-items')).to.be.true;
  });

  it('should not apply "few-items" class when there are more entities than preview count', async () => {
    mockConfig.preview_count = 2;
    const result = renderSection(
      mockHass,
      mockConfig,
      'Test Section',
      mockEntities,
      false,
      noop,
    );
    const el = await fixture(result as TemplateResult);

    expect(el.classList.contains('few-items')).to.be.false;
  });

  it('should show the correct number of items based on preview_count when not expanded', async () => {
    mockConfig.preview_count = 2;

    const result = renderSection(
      mockHass,
      mockConfig,
      'Test Section',
      mockEntities,
      false,
      noop,
    );
    const el = await fixture(result as TemplateResult);

    const rows = el.querySelectorAll('petkit-device-row');
    expect(rows.length).to.equal(2);
  });

  it('should show all items when section is expanded', async () => {
    mockConfig.preview_count = 1;

    const result = renderSection(
      mockHass,
      mockConfig,
      'Test Section',
      mockEntities,
      true,
      noop,
    );
    const el = await fixture(result as TemplateResult);

    const rows = el.querySelectorAll('petkit-device-row');
    expect(rows.length).to.equal(mockEntities.length);
  });

  it('should apply "expanded" class to section when expanded', async () => {
    const result = renderSection(
      mockHass,
      mockConfig,
      'Test Section',
      mockEntities,
      true,
      noop,
    );
    const el = await fixture(result as TemplateResult);

    expect(el.classList.contains('expanded')).to.be.true;
  });

  it('should render "Show more" text with correct count when not expanded', async () => {
    mockConfig.preview_count = 1;

    const result = renderSection(
      mockHass,
      mockConfig,
      'Test Section',
      mockEntities,
      false,
      noop,
    );
    const el = await fixture(result as TemplateResult);

    const showMoreElement = el.querySelector('.show-more');
    expect(showMoreElement).to.exist;
    expect(showMoreElement?.textContent?.trim()).to.include('Show 3 more...');
  });

  it('should not render "Show more" text when expanded', async () => {
    mockConfig.preview_count = 1;

    const result = renderSection(
      mockHass,
      mockConfig,
      'Test Section',
      mockEntities,
      true,
      noop,
    );
    const el = await fixture(result as TemplateResult);

    const showMoreElement = el.querySelector('.show-more');
    expect(showMoreElement).to.not.exist;
  });

  it('should render chevron icon with correct direction based on expanded state', async () => {
    mockConfig.preview_count = 1;

    let result = renderSection(
      mockHass,
      mockConfig,
      'Test Section',
      mockEntities,
      false,
      noop,
    );
    let el = await fixture(result as TemplateResult);
    let chevronIcon = el.querySelector('ha-icon');
    expect(chevronIcon?.getAttribute('icon')).to.equal('mdi:chevron-down');

    result = renderSection(
      mockHass,
      mockConfig,
      'Test Section',
      mockEntities,
      true,
      noop,
    );
    el = await fixture(result as TemplateResult);
    chevronIcon = el.querySelector('ha-icon');
    expect(chevronIcon?.getAttribute('icon')).to.equal('mdi:chevron-up');
  });

  it('should not render chevron or footer when there are fewer entities than preview count', async () => {
    mockConfig.preview_count = 5;

    const result = renderSection(
      mockHass,
      mockConfig,
      'Test Section',
      mockEntities,
      false,
      noop,
    );
    const el = await fixture(result as TemplateResult);

    const chevron = el.querySelector('.section-chevron');
    const footer = el.querySelector('.section-footer');

    expect(chevron).to.not.exist;
    expect(footer).to.not.exist;
  });

  it('should render one petkit-device-row per entity', async () => {
    const result = renderSection(
      mockHass,
      mockConfig,
      'Test Section',
      mockEntities,
      false,
      noop,
    );
    const el = await fixture(result as TemplateResult);

    const rows = el.querySelectorAll('petkit-device-row');
    expect(rows.length).to.equal(mockEntities.length);
  });

  it('should invoke toggle when clicking on chevron', async () => {
    mockConfig.preview_count = 1;
    let toggled = false;
    const onToggle = () => {
      toggled = true;
    };

    const result = renderSection(
      mockHass,
      mockConfig,
      'Test Section',
      mockEntities,
      false,
      onToggle,
    );
    const el = await fixture(result as TemplateResult);

    const chevron = el.querySelector('.section-chevron') as HTMLElement;
    expect(chevron).to.exist;

    chevron.click();

    expect(toggled).to.be.true;
  });

  it('should invoke toggle when clicking on "Show more"', async () => {
    mockConfig.preview_count = 1;
    let toggled = false;
    const onToggle = () => {
      toggled = true;
    };

    const result = renderSection(
      mockHass,
      mockConfig,
      'Test Section',
      mockEntities,
      false,
      onToggle,
    );
    const el = await fixture(result as TemplateResult);

    const showMore = el.querySelector('.show-more') as HTMLElement;
    expect(showMore).to.exist;

    showMore.click();

    expect(toggled).to.be.true;
  });
});
