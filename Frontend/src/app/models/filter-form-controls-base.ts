import { FormControl, AbstractControl } from '@angular/forms';

export class FilterFormControlsBase<T> {
  value: T;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  cssClass: string;
  placeHolder: string;
  hidden: boolean;
  constructor(
    options: {
      value?: T;
      key?: string;
      label?: string;
      required?: boolean;
      order?: number;
      controlType?: string;
      cssClass?: string;
      placeHolder?: string;
      hidden?: boolean;
    } = {}
  ) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.cssClass = options.cssClass || '';
    this.placeHolder = options.placeHolder;
    this.hidden = options.hidden;
  }
}

export class DropdownFilterControl extends FilterFormControlsBase<string> {
  controlType = 'dropdown';
  options: { key: string; value: string }[] = [];
  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}

export class DateRangeFilterControl extends FilterFormControlsBase<string> {
  controlType = 'daterange';
  options: { key: string; value: string }[] = [];
  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}

export class ControlNameValuePair {
  controlModel: any;
  control: AbstractControl;
}
