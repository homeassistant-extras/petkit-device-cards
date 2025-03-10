import cardEntitiesSpec from './card-entities.spec';
import hasProblemSpec from './has-problem.spec';
import isPetkitSpec from './is-petkit.spec';

export default () => {
  describe('utils', () => {
    cardEntitiesSpec();
    hasProblemSpec();
    isPetkitSpec();
  });
};
