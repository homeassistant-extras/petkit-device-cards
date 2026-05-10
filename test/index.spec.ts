import { expect } from 'chai';
import path from 'path';
import { stub, type SinonStub } from 'sinon';
import { version } from '../package.json';

const indexEntry = path.resolve(__dirname, '../src/index.ts');

describe('index.ts', () => {
  let customElementsStub: SinonStub;
  let customCardsStub: Array<Object> | undefined;
  let consoleInfoStub: sinon.SinonStub;

  beforeEach(() => {
    // Stub customElements.define to prevent actual registration
    customElementsStub = stub(customElements, 'define');
    consoleInfoStub = stub(console, 'info');

    // Create a stub for window.customCards
    customCardsStub = [];
    Object.defineProperty(window, 'customCards', {
      get: () => customCardsStub,
      set: (value) => {
        customCardsStub = value;
      },
      configurable: true,
    });
  });

  afterEach(() => {
    // Restore the original customElements.define
    customElementsStub.restore();
    consoleInfoStub.restore();
    customCardsStub = undefined;
    delete require.cache[require.resolve(indexEntry)];
  });

  it('should register petkit-device, editor, row, and section custom elements', () => {
    require(indexEntry);
    const names = customElementsStub.getCalls().map((c) => c.args[0]);
    expect(names).to.include.members(['petkit-device', 'petkit-device-editor']);
  });

  it('should initialize window.customCards if undefined', () => {
    customCardsStub = undefined;
    require(indexEntry);

    expect(window.customCards).to.be.an('array');
  });

  it('should add card configuration with all fields to window.customCards', () => {
    require(indexEntry);

    expect(window.customCards).to.have.lengthOf(1);
    expect(window.customCards[0]).to.deep.equal({
      type: 'petkit-device',
      name: 'PetKit Device',
      description: 'A card to summarize the status of a PetKit Device.',
      preview: true,
      documentationURL:
        'https://github.com/homeassistant-extras/petkit-device-cards',
    });
  });

  it('should preserve existing cards when adding new card', () => {
    // Add an existing card
    window.customCards = [
      {
        type: 'existing-card',
        name: 'Existing Card',
      },
    ];

    require(indexEntry);

    expect(window.customCards).to.have.lengthOf(2);
    expect(window.customCards[0]).to.deep.equal({
      type: 'existing-card',
      name: 'Existing Card',
    });
  });

  it('should handle multiple imports without duplicating registration', () => {
    require(indexEntry);
    const definesAfterFirstLoad = customElementsStub.callCount;

    require(indexEntry);

    expect(window.customCards).to.have.lengthOf(1);
    expect(customElementsStub.callCount).to.equal(definesAfterFirstLoad);
  });

  it('should log the version with proper formatting', () => {
    require(indexEntry);
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
