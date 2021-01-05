import { Injectable } from '@angular/core';
import {
  FilterFormControlsBase,
  DropdownFilterControl,
  DateRangeFilterControl,
} from '../models/filter-form-controls-base';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})

export class FilterControlsService {
  constructor() {}

  toFormGroup(filtersarray: FilterFormControlsBase<any>[]): FormGroup 
  {
    let group: any = {};

    filtersarray.forEach((fil) => {
      if (fil.controlType === 'daterange') {
        let datefil = fil as DateRangeFilterControl;
        datefil.options.forEach((op) => {
          group[op.key] = fil.required
            ? new FormControl(op.value || '', Validators.required)
            : new FormControl(op.value || '');
        });
      } else {
        group[fil.key] = fil.required
          ? new FormControl(fil.value || '', Validators.required)
          : new FormControl(fil.value || '');
      }
    });
    return new FormGroup(group);
  } 
}
