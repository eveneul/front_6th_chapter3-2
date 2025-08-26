import { Event } from '../types';

export const generateRepeatEvents = (mockEvent: Event) => {
  const repeatType = mockEvent.repeat?.type;

  // 반복 일정이 아니라면 원본 이벤트만 반환
  if (!repeatType || repeatType === 'none') {
    return [mockEvent];
  }

  // endDate가 없으면 원본 이벤트만 반환
  if (!mockEvent.repeat.endDate) {
    return [mockEvent];
  }

  const events = [] as Event[];
  const startDate = new Date(mockEvent.date); // Mon Aug 25 2025.. 이런 형태로 나옴
  const endDate = new Date(mockEvent.repeat.endDate);
  const interval = mockEvent.repeat.interval || 1;

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const eventDate = currentDate.toISOString().split('T')[0]; // 2025-08-25 형태로 변환

    events.push({
      ...mockEvent,
      date: eventDate,
    });

    switch (repeatType) {
      case 'daily': {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + interval);
        currentDate = newDate;
        break;
      }

      case 'weekly': {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + interval * 7);
        currentDate = newDate;
        break;
      }

      case 'monthly': {
        // 매월 반복은 같은 일이 반복되어야 하기 때문에 day를 구함
        const originalDay = startDate.getDate(); // 처음 시작한 날짜

        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + interval); // 다음 달로
        newDate.setDate(originalDay); // 원래 일자로 설정 시도

        // 만약 해당 달에 그 날짜가 없다면(originalDay)
        if (newDate.getDate() !== originalDay) {
          // 건너뛰고 다음 달로
          currentDate = newDate;
          continue;
        }

        currentDate = newDate;
        break;
      }

      case 'yearly': {
        // 매년 반복은 같은 달, 같은 날이 반복되어야 하기 때문에 month, day를 구함
        const originalMonth = startDate.getMonth();
        const originalDay = startDate.getDate();

        const newDate = new Date(currentDate);
        newDate.setFullYear(currentDate.getFullYear() + interval);
        newDate.setMonth(originalMonth);
        newDate.setDate(originalDay);

        if (originalMonth === 1 && originalDay === 29) {
          if (!isLeapYear(newDate.getFullYear())) {
            currentDate = newDate;
            continue;
          }
        }

        currentDate = newDate;
        break;
      }
    }
  }

  return events;
};

// 윤년 판별
const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
