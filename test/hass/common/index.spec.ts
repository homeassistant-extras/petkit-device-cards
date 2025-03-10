import literalIncludesSpec from './array/literal-includes.spec';
import fireEventSpec from './dom/fire-event.spec';
import entitySpec from './entity/index.spec';
export default () => {
  describe('common', () => {
    describe('array', () => {
      literalIncludesSpec();
    });
    describe('dom', () => {
      fireEventSpec();
    });

    entitySpec();
  });
};
