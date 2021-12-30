import { Calendar, Month, Week, Year } from "./calendar";

const {
  numberOfDaysInAMonth,
  numberOfDaysInAYear,
  findYear,
  findMonth,
  spesificDate,
} = require("./calendar");

const mockWeek: Week = { numberOfDays: 10 };

const mockMonth: Month = { weeks: [mockWeek, mockWeek, mockWeek] };

const mockYear: Year = { months: [mockMonth, mockMonth, mockMonth] };

function getMockYear(): Year {
  return Object.assign({}, mockYear);
}

function getMockLeapYear(): Year {
  return { months: [{ weeks: [{ numberOfDays: 1 }] }] };
}

function getCalendar(): Calendar {
  return Object.assign(
    {},
    {
      normalYear: getMockYear(),
      leapYear: getMockLeapYear(),
      isLeapYear: (yearNumber: number) => yearNumber % 4 === 0,
    }
  );
}

describe("numberOfDaysInAMonth", () => {
  it("works", () => {
    // arrange
    const month: Month = {
      weeks: [
        { numberOfDays: 5 },
        { numberOfDays: 5 },
        { numberOfDays: 5 },
        { numberOfDays: 5 },
      ],
    };
    // act
    const result = numberOfDaysInAMonth(month);

    // assert
    expect(result).toBe(20);
  });

  it("can take a month with no weeks", () => {
    // arrange
    const month: Month = { weeks: [] };

    //act
    const result = numberOfDaysInAMonth(month);

    // assert
    expect(result).toBe(0);
  });

  it("does not require identical weeks", () => {
    // arrange
    const month: Month = { weeks: [{ numberOfDays: 3 }, { numberOfDays: 5 }] };

    // act
    const result = numberOfDaysInAMonth(month);

    //assert
    expect(result).toBe(8);
  });

  it("fails on wrongly typed parameters", () => {
    expect(() => numberOfDaysInAMonth(undefined)).toThrowError();
    expect(() => numberOfDaysInAMonth(false)).toThrowError();
    expect(() => numberOfDaysInAMonth("hello world")).toThrowError();
    expect(() => numberOfDaysInAMonth([])).toThrowError();
    expect(() => numberOfDaysInAMonth(null)).toThrowError();
    expect(() => numberOfDaysInAMonth(NaN)).toThrowError();
    expect(() => numberOfDaysInAMonth({})).toThrowError();
  });
});

describe("numberOfDaysInAYear", () => {
  it("works", () => {
    // arrange
    const mockCalendar = getCalendar();

    // act
    const result = numberOfDaysInAYear(mockCalendar.normalYear);
    const leapResult = numberOfDaysInAYear(mockCalendar.leapYear);

    // assert
    expect(result).toBe(90);
    expect(leapResult).toBe(1);
  });

  it("it should manage to only find one day", () => {
    // arrange
    const year: Year = {
      months: [{ weeks: [{ numberOfDays: 1 }] }],
    };

    // act
    const result = numberOfDaysInAYear(year);

    // assert
    expect(result).toBe(1);
  });

  it("fails on wrongly typed parameters", () => {
    expect(() => numberOfDaysInAYear(undefined)).toThrowError();
    expect(() => numberOfDaysInAYear(false)).toThrowError();
    expect(() => numberOfDaysInAYear("hello world")).toThrowError();
    expect(() => numberOfDaysInAYear([])).toThrowError();
    expect(() => numberOfDaysInAYear(null)).toThrowError();
    expect(() => numberOfDaysInAYear(NaN)).toThrowError();
    expect(() => numberOfDaysInAYear({})).toThrowError();
  });
});

describe("findMonth", () => {
  it("works", () => {
    // arrange
    const mockCalendar = getCalendar();

    // assert
    expect(findMonth(mockCalendar, 0)).toBe(0);
    expect(findMonth(mockCalendar, 1)).toBe(0);
    expect(findMonth(mockCalendar, 31)).toBe(1);
    expect(findMonth(mockCalendar, 91)).toBe(0);
  });

  it("does rollover on years", () => {
    // arrange
    const mockCalendar = getCalendar();

    // act
    const result = findMonth(mockCalendar, 152);

    // assert
    expect(result).toBe(2);
  });

  it("is null-indexed", () => {
    // arrange
    const mockCalendar = getCalendar();

    // act
    const result = findMonth(mockCalendar, 0);

    // assert
    expect(result).toBe(0);
  });
});

describe("findYear", () => {
  it("works", () => {
    // arrange
    const calendar = getCalendar();
    calendar.isLeapYear = (yearNumber: number) => false;

    // act
    const result = findYear(calendar, 2200);

    // assert
    expect(result).toBe(24);
  });

  it("first year is a leap year", () => {
    const calendar = getCalendar();

    // act
    const result = findYear(calendar, 1);

    // assert
    expect(result).toBe(1);
  });

  it("manages leapyears", () => {
    // arrange
    const calendar = getCalendar();

    // assert
    expect(findYear(calendar, 0)).toBe(0);
    expect(findYear(calendar, 1)).toBe(1);
    expect(findYear(calendar, 91)).toBe(2);
    expect(findYear(calendar, 181)).toBe(3);
    expect(findYear(calendar, 271)).toBe(4);
    expect(findYear(calendar, 272)).toBe(5);
  });
  it("is null-indexed", () => {
    // arrange
    const mockCalendar = getCalendar();

    // act
    const result = findYear(mockCalendar, 0);

    // assert
    expect(result).toBe(0);
  });
});

describe("When asking for the year", () => {
  it("it should be 0-indexed", () => {
    const calendar = getCalendar();
    expect(findYear(calendar, 0)).toBe(0);
  });
  it("it should start a new year after 90 days (number of days in mock)", () => {
    const calendar = getCalendar();
    calendar.isLeapYear = (year) => false; // Make sure there are no leap years.
    expect(findYear(calendar, 89)).toBe(0);
    expect(findYear(calendar, 90)).toBe(1);
  });
  it("it should take leap years into consideration (leap year is 1 day long)", () => {
    const calendar = getCalendar();
    calendar.isLeapYear = (year) => year % 2 === 0; // Leap year every second year, starting with the first.
    expect(findYear(calendar, 0)).toBe(0);
    expect(findYear(calendar, 1)).toBe(1);
    expect(findYear(calendar, 91)).toBe(2);
    expect(findYear(calendar, 92)).toBe(3);
  });
  it("it should work with negative days from origin", () => {
    const calendar = getCalendar();
    expect(findYear(calendar, -1)).toBe(-1);
    expect(findYear(calendar, -91)).toBe(-2);
    expect(findYear(calendar, -92)).toBe(-3);
  });
});

describe("When asking for a spesific date", () => {
  it("it should return an object containing all spesific date properties", () => {
    const result = spesificDate();
    expect(result).toHaveProperty("year");
    expect(result).toHaveProperty("month");
    expect(result).toHaveProperty("week");
    expect(result).toHaveProperty("day");
  });
});
