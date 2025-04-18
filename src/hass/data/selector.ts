/**
 * https://github.com/home-assistant/frontend/blob/dev/src/data/selector.ts
 */

export type Selector = DeviceSelector | SelectSelector | StringSelector;

interface DeviceSelectorFilter {
  integration?: string;
  manufacturer?: string;
  model?: string;
  model_id?: string;
}

export interface DeviceSelector {
  device: {
    filter?: DeviceSelectorFilter | readonly DeviceSelectorFilter[];
    entity?: EntitySelectorFilter | readonly EntitySelectorFilter[];
    multiple?: boolean;
  } | null;
}

interface EntitySelectorFilter {
  integration?: string;
  domain?: string | readonly string[];
  device_class?: string | readonly string[];
  supported_features?: number | [number];
}

export interface SelectSelector {
  select: {
    multiple?: boolean;
    custom_value?: boolean;
    mode?: 'list' | 'dropdown';
    options: string[] | SelectOption[];
  };
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface StringSelector {
  text: {
    multiline?: boolean;
    type?:
      | 'number'
      | 'text'
      | 'search'
      | 'tel'
      | 'url'
      | 'email'
      | 'password'
      | 'date'
      | 'month'
      | 'week'
      | 'time'
      | 'datetime-local'
      | 'color';
    suffix?: string;
  };
}
