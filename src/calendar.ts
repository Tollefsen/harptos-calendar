export type Calendar = {
  normalYear: Year;
  leapYear: Year;
  isLeapYear: (yearNumber: number) => boolean;
};

export type Year = {
  months: Month[];
};

export type Month = {
  weeks: Week[];
};

export type Week = {
  numberOfDays: number;
};

export type SpesificDate = {
  year: number;
  month: number;
  week: number;
  day: number;
};

export function numberOfDaysInAMonth(month: Month): number {
  return month.weeks.reduce((a, c) => a + c.numberOfDays, 0);
}

export function numberOfDaysInAYear(year: Year): number {
  return year.months.reduce((a, c) => a + numberOfDaysInAMonth(c), 0);
}

export function findYear(calendar: Calendar, daysFromOrigin: number): number {
  let numberOfDaysTraversed = 0;
  let yearNumber = 0;
  const daysInANormalYear = numberOfDaysInAYear(calendar.normalYear);
  const daysInALeapYear = numberOfDaysInAYear(calendar.leapYear);
  let isFinished = false;
  while (!isFinished) {
    const isLeapYear = calendar.isLeapYear(yearNumber);
    const daysInThisYear = isLeapYear ? daysInALeapYear : daysInANormalYear;
    if (numberOfDaysTraversed + daysInThisYear > daysFromOrigin) {
      isFinished = true;
    } else {
      numberOfDaysTraversed += daysInThisYear;
      yearNumber++;
    }
  }

  return yearNumber;
  // This is how one can do it when there are no leap years.
  //return Math.floor(daysFromOrigin / numberOfDaysInAYear(year));
}

export function findMonth(calendar: Calendar, daysFromOrigin: number): number {
  const remainderByYear =
    daysFromOrigin % numberOfDaysInAYear(calendar.normalYear);
  return remainderByYear % calendar.normalYear.months.length;
}

export function spesificDate(): SpesificDate {
  return { year: 0, month: 0, week: 0, day: 0 };
}
