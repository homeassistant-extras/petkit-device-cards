import {
  actionHandler,
  handleClickAction,
} from '@delegates/action-handler-delegate';
import * as fireEventModule from '@hass/common/dom/fire_event';
import type { ActionHandlerEvent } from '@hass/data/lovelace/action_handler';
import * as actionHandlerDirective from '@hass/panels/lovelace/common/directives/action-handler-directive';
import type { EntityInformation } from '@type/config';
import { expect } from 'chai';
import { restore, stub, type SinonStub } from 'sinon';

describe('action-handler-delegate.ts', () => {
  let mockElement: HTMLElement;
  let mockEntity: EntityInformation;
  let hassActionHandlerStub: SinonStub;
  let fireEventStub: SinonStub;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockEntity = {
      entity_id: 'sensor.test',
      state: '50',
      translation_key: undefined,
      attributes: {},
      config: {
        tap_action: { action: 'more-info' },
        hold_action: { action: 'more-info' },
      },
    } as EntityInformation;

    hassActionHandlerStub = stub(
      actionHandlerDirective,
      'actionHandler',
    ).returns({});
    fireEventStub = stub(fireEventModule, 'fireEvent');
  });

  afterEach(() => {
    restore();
  });

  describe('actionHandler', () => {
    it('should create action handler with double click enabled when configured', () => {
      mockEntity.config = {
        double_tap_action: { action: 'more-info' },
      };

      actionHandler(mockEntity);

      expect(hassActionHandlerStub.calledOnce).to.be.true;
      expect(hassActionHandlerStub.firstCall.args[0]).to.deep.equal({
        hasDoubleClick: true,
        hasHold: false,
      });
    });

    it('should create action handler with hold enabled when configured', () => {
      mockEntity.config = {
        hold_action: { action: 'more-info' },
      };

      actionHandler(mockEntity);

      expect(hassActionHandlerStub.firstCall.args[0]).to.deep.equal({
        hasDoubleClick: false,
        hasHold: true,
      });
    });

    it('should not enable actions when action is "none"', () => {
      mockEntity.config = {
        hold_action: { action: 'none' },
        double_tap_action: { action: 'none' },
      };

      actionHandler(mockEntity);

      expect(hassActionHandlerStub.firstCall.args[0]).to.deep.equal({
        hasDoubleClick: false,
        hasHold: false,
      });
    });
  });

  describe('handleClickAction', () => {
    it('should fire hass-action event with tap action', () => {
      const handler = handleClickAction(mockElement, mockEntity);
      const mockEvent = {
        detail: { action: 'tap' },
      } as ActionHandlerEvent;

      handler.handleEvent(mockEvent);

      expect(fireEventStub.calledOnce).to.be.true;
      expect(fireEventStub.firstCall.args[0]).to.equal(mockElement);
      expect(fireEventStub.firstCall.args[1]).to.equal('hass-action');
      expect(fireEventStub.firstCall.args[2]).to.deep.equal({
        config: {
          entity: 'sensor.test',
          tap_action: { action: 'more-info' },
          hold_action: { action: 'more-info' },
        },
        action: 'tap',
      });
    });

    it('should fire hass-action event with hold action', () => {
      const handler = handleClickAction(mockElement, mockEntity);
      const mockEvent = {
        detail: { action: 'hold' },
      } as ActionHandlerEvent;

      handler.handleEvent(mockEvent);

      expect(fireEventStub.firstCall.args[2]).to.deep.equal({
        config: {
          entity: 'sensor.test',
          tap_action: { action: 'more-info' },
          hold_action: { action: 'more-info' },
        },
        action: 'hold',
      });
    });

    it('should not fire event when action is missing', () => {
      const handler = handleClickAction(mockElement, mockEntity);
      const mockEvent = {
        detail: {},
      } as ActionHandlerEvent;

      handler.handleEvent(mockEvent);

      expect(fireEventStub.called).to.be.false;
    });
  });
});
