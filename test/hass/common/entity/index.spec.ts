import computeDomainSpec from './compute_domain.spec';
import stateActiveSpec from './state_active.spec';

export default () => {
  describe('entity', () => {
    describe('color', () => {});
    computeDomainSpec();
    stateActiveSpec();
  });
};
