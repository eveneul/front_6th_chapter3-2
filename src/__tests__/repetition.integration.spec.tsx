import { Event } from '../types';
import { addRepeatIconIfNeeded } from '../utils/addRepeatIconIfNeeded';
import { expandRecurringEvent } from '../utils/expandRecurringEvent';

describe('반복 유형 선택', () => {
  describe('사용자가 반복 유형을 매일로 설정한다', () => {
    test('2025-08-25 09:00에 시작하는 일정에서 2025-08-30까지 매일 반복 설정 시 해당 기간 동안 매일 이벤트가 생성된다', () => {
      const mockEvent: Event = {
        id: undefined,
        title: '양꼬치 먹는 날',
        date: '2025-08-25',
        startTime: '09:00',
        endTime: '10:00',
        description: '양꼬치 맛있겠다',
        location: '합정역',
        category: '개인',
        repeat: {
          type: 'daily',
          interval: 1,
          endDate: '2025-08-30',
        },
        notificationTime: 10,
      };

      const result = expandRecurringEvent(mockEvent);

      // 8/25, 8/26, 8/27, 8/28, 8/29, 8/30 -> 6개
      expect(result).toHaveLength(6);

      // 반복 날짜들
      const expectedDates = [
        '2025-08-25',
        '2025-08-26',
        '2025-08-27',
        '2025-08-28',
        '2025-08-29',
        '2025-08-30',
      ];

      expectedDates.forEach((date, index) => {
        expect(result[index].date).toBe(date);
      });
    });
  });

  describe('사용자가 반복 유형을 매주로 설정한다', () => {
    test('2025-08-25 09:00에 시작하는 일정에서 2025-09-08까지 매주 반복 설정 시 해당 기간 동안 매주 이벤트가 생성된다', () => {
      const mockEvent: Event = {
        id: undefined,
        title: '양꼬치 먹는 날',
        date: '2025-08-25',
        startTime: '09:00',
        endTime: '10:00',
        description: '양꼬치 맛있겠다',
        location: '합정역',
        category: '개인',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-09-08',
        },
        notificationTime: 10,
      };

      const result = expandRecurringEvent(mockEvent);

      // 8/25, 9/01, 9/09 -> 3개
      expect(result).toHaveLength(3);

      // 반복 날짜들
      const expectedDates = ['2025-08-25', '2025-09-01', '2025-09-08'];

      expectedDates.forEach((date, index) => {
        expect(result[index].date).toBe(date);
      });
    });
  });

  describe('사용자가 반복 유형을 매월로 설정한다', () => {
    test('2025-01-31 09:00에 시작하는 일정에서 2025-12월까지 매월 반복 설정 시 해당 기간 동안 매월 이벤트가 생성된다', () => {
      const mockEvent: Event = {
        id: undefined,
        title: '양꼬치 먹는 날',
        date: '2025-01-31',
        startTime: '09:00',
        endTime: '10:00',
        description: '양꼬치 맛있겠다',
        location: '합정역',
        category: '개인',
        repeat: {
          type: 'monthly',
          interval: 1,
          endDate: '2025-12-31',
        },
        notificationTime: 10,
      };

      const result = expandRecurringEvent(mockEvent);

      console.log(result);
      expect(result).toHaveLength(7);

      // 반복 날짜들
      const expectedDates = [
        '2025-01-31',
        '2025-03-31',
        '2025-05-31',
        '2025-07-31',
        '2025-08-31',
        '2025-10-31',
        '2025-12-31',
      ];

      expectedDates.forEach((date, index) => {
        expect(result[index].date).toBe(date);
      });
    });
  });

  describe('사용자가 반복 유형을 매년으로 설정한다', () => {
    test('2025-08-25 09:00에 시작하는 일정에서 2027년까지 매년 반복 설정 시 해당 기간 동안 매년 이벤트가 생성된다', () => {
      const mockEvent: Event = {
        id: undefined,
        title: '양꼬치 먹는 날',
        date: '2025-08-25',
        startTime: '09:00',
        endTime: '10:00',
        description: '양꼬치 맛있겠다',
        location: '합정역',
        category: '개인',
        repeat: {
          type: 'yearly',
          interval: 1,
          endDate: '2027-08-25',
        },
        notificationTime: 10,
      };

      const result = expandRecurringEvent(mockEvent);

      // 25년, 26년, 27년 -> 3개
      expect(result).toHaveLength(3);

      // 반복 날짜들
      const expectedDates = ['2025-08-25', '2026-08-25', '2027-08-25'];

      expectedDates.forEach((date, index) => {
        expect(result[index].date).toBe(date);
      });
    });
  });

  describe('사용자가 반복 유형을 윤년으로 설정한다', () => {
    test('2024-02-29 09:00에 시작하는 일정에서 2028년까지 매년 반복 설정 시 윤년 2월 29일에 이벤트가 생성된다', () => {
      const mockEvent: Event = {
        id: undefined,
        title: '양꼬치 먹는 날',
        date: '2024-02-29',
        startTime: '09:00',
        endTime: '10:00',
        description: '양꼬치 맛있겠다',
        location: '합정역',
        category: '개인',
        repeat: {
          type: 'yearly',
          interval: 1,
          endDate: '2029-02-28',
        },
        notificationTime: 10,
      };

      const result = expandRecurringEvent(mockEvent);

      // 24년, 28년 -> 2개
      console.log(result);
      expect(result).toHaveLength(2);

      // 반복 날짜들
      const expectedDates = ['2024-02-29', '2028-02-29'];

      expectedDates.forEach((date, index) => {
        expect(result[index].date).toBe(date);
      });
    });
  });
});

describe('캘린더 뷰에서 반복 일정 아이콘을 넣어 구분하여 표시한다.', () => {
  describe('반복 일정이 없는 일정은 반복 아이콘이 없다.', () => {
    test('반복 일정이 없는 일정은 반복 아이콘이 없다.', () => {
      const mockEvent: Event = {
        id: undefined,
        title: '양꼬치 먹는 날',
        date: '2025-08-28',
        startTime: '09:00',
        endTime: '10:00',
        description: '양꼬치 맛있겠다',
        location: '합정역',
        category: '개인',
        repeat: {
          type: 'none',
          interval: 1,
          endDate: '2025-08-28',
        },
        notificationTime: 10,
      };

      const result = addRepeatIconIfNeeded(mockEvent);
      console.log(result);

      expect(result[0].repeat.repeatIcon).toBeFalsy();
    });
  });

  describe('반복 일정이 있는 일정은 반복 아이콘이 있다.', () => {
    test('반복 일정이 있는 일정은 반복 아이콘이 있다.', () => {
      const mockEvent: Event = {
        id: undefined,
        title: '양꼬치 먹는 날',
        date: '2025-08-25',
        startTime: '09:00',
        endTime: '10:00',
        description: '양꼬치 맛있겠다',
        location: '합정역',
        category: '개인',
        repeat: {
          type: 'daily',
          interval: 1,
          endDate: '2025-08-31',
        },
        notificationTime: 10,
      };
      const result = addRepeatIconIfNeeded(mockEvent);

      expect(result).toHaveLength(7);
      expect(result[0].repeat?.repeatIcon).toBe(true);
      expect(result.every((e) => e.repeat?.repeatIcon)).toBe(true);
    });
  });
});

describe('반복 종료 조건 (특정 날짜까지)', () => {
  test('유효한 반복 종료일 지정 시 해당 날짜까지 반복된다', () => {
    const mockEvent: Event = {
      id: undefined,
      title: '양꼬치 먹는 날',
      date: '2025-08-25',
      startTime: '09:00',
      endTime: '10:00',
      description: '양꼬치 맛있겠다',
      location: '합정역',
      category: '개인',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2025-09-10',
      },
      notificationTime: 10,
    };

    const result = expandRecurringEvent(mockEvent);

    // 8/25, 9/01, 9/09 -> 3개
    expect(result).toHaveLength(3);

    // 반복 날짜들
    const expectedDates = ['2025-08-25', '2025-09-01', '2025-09-08'];

    expectedDates.forEach((date, index) => {
      expect(result[index].date).toBe(date);
    });
  });

  test('유효한 반복 종료일 지정 시 해당 날짜까지 반복된다', () => {
    const mockEvent: Event = {
      id: undefined,
      title: '양꼬치 먹는 날',
      date: '2025-09-01',
      startTime: '09:00',
      endTime: '10:00',
      description: '양꼬치 맛있겠다',
      location: '합정역',
      category: '개인',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2025-08-25',
      },
      notificationTime: 10,
    };

    const result = expandRecurringEvent(mockEvent);
    console.log(result);

    expect(result).toHaveLength(1);
  });
});
