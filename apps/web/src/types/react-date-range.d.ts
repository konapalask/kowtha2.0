declare module 'react-date-range' {
  import { ComponentType } from 'react';

  export interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
    key: string;
  }

  export interface DateRangeProps {
    ranges: DateRange[];
    onChange: (ranges: { selection: DateRange }) => void;
    months?: number;
    direction?: 'horizontal' | 'vertical';
    showDateDisplay?: boolean;
    rangeColors?: string[];
    minDate?: Date;
    maxDate?: Date;
  }

  const DateRange: ComponentType<DateRangeProps>;
  export default DateRange;
} 