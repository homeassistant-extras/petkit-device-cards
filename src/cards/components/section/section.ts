import '@cards/components/row/row';
import { HassConfigMixin } from '@cards/mixins/hass-config-mixin';
import { renderSection } from '@html/section';
import type { EntityInformation } from '@type/config';
import { CSSResult, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styles } from './styles';

/**
 * One collapsible section (controls, sensors, etc.). Expand/collapse is local so
 * toggling does not re-render sibling sections.
 */
@customElement('petkit-device-section')
export class PetKitDeviceSection extends HassConfigMixin(LitElement) {
  @property({ attribute: false })
  public sectionTitle!: string;

  @property({ attribute: false })
  public entities!: EntityInformation[];

  @state()
  private _expanded: boolean = false;

  private readonly _toggleSection = () => {
    this._expanded = !this._expanded;
  };

  static override get styles(): CSSResult {
    return styles;
  }

  override render(): TemplateResult | typeof nothing {
    console.log('render - section', this.sectionTitle);
    return renderSection(
      this.hass,
      this.config,
      this.sectionTitle,
      this.entities,
      this._expanded,
      this._toggleSection,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'petkit-device-section': PetKitDeviceSection;
  }
}
