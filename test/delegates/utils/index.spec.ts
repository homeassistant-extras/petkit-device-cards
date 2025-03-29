import cardEntitiesSpec from './card-entities.spec';
import hasProblemSpec from './has-problem.spec';
import isPetkitSpec from './is-petkit.spec';
import petKitUnitSpec from './petkit-unit.spec';

export default () => {
  describe('utils', () => {
    cardEntitiesSpec();
    hasProblemSpec();
    isPetkitSpec();
    petKitUnitSpec();
  });
};
