import { createContext, useContext } from 'react';
import { PopupPosition } from 'reactjs-popup/dist/types';

import { CalendarValue, DatePickerVariant, IntervalVariants } from '../types';
import { PopupControls } from '@/hooks';

type DatePickerContextState = {
  controlDate: Date;
  nextControlDate: () => void;
  prevControlDate: () => void;

  startRange: Date | null;
  endRange: Date | null;
  selectStartRange: (date: Date | null) => void;
  selectEndRange: (date: Date | null) => void;
  selectDate: (date: Date | null) => void;

  interval: IntervalVariants;
  changeInterval: (interval: string) => void;

  variant: DatePickerVariant;

  value: CalendarValue;
  modalControls: PopupControls;
  onChange: (value: CalendarValue) => void;

  reset: () => void;
  position?: PopupPosition | PopupPosition[];
  disabledDates?: Date[];
  maxDate?: Date;
  minDate?: Date;
  intervals?: IntervalVariants[];
};

const DatePickerContext = createContext({} as DatePickerContextState);

const useDatePickerContext = () => useContext(DatePickerContext);

export { DatePickerContext, useDatePickerContext };
