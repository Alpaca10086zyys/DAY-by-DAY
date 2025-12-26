// src/calendar/utils/calendarEngine.ts
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  addYears,
} from 'date-fns';
import { getConfig, CalendarConfig } from './configManager';
import { format } from 'date-fns';
import { zhCN, enUS, ja, ko } from 'date-fns/locale';

const LOCALES = {
  zhCN,
  enUS,
  ja,
  ko,
};

export type ViewMode = 'year' | 'month' | 'week' | 'day';

export class CalendarEngine {
  date: Date;
  anchorDate: Date;
  config: CalendarConfig;

  constructor(date: Date) {
    this.date = date;
    this.anchorDate = date;
    this.config = getConfig();
  }

  // 更新配置
  updateConfig(newConfig: Partial<CalendarConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  //设置锚点日期（更新用）
  setAnchorDate(d: Date) {
    this.anchorDate = d;
  }

  getAnchorDate() {
    return this.anchorDate;
  }

  // 年视图：返回12个月
  getYearMonths() {
    const months: Date[] = [];
    for (let i = 0; i < 12; i++) {
      months.push(new Date(this.date.getFullYear(), i, 1));
    }
    return months;
  }

  getMonthGridByDate(date: Date) {
    const start = startOfWeek(startOfMonth(date), {
      weekStartsOn: this.config.weekStartsOn,
    });
    const end = endOfWeek(endOfMonth(date), {
      weekStartsOn: this.config.weekStartsOn,
    });

    const days: Date[] = [];
    let current = start;

    while (current <= end) {
      days.push(current);
      current = addDays(current, 1);
    }

    return days;
  }

  // 月视图：返回一整个月格子（可能包含前后月份）
  getMonthGrid() {
    const start = startOfWeek(startOfMonth(this.date), { weekStartsOn: this.config.weekStartsOn });
    const end = endOfWeek(endOfMonth(this.date), { weekStartsOn: this.config.weekStartsOn });

    const days: Date[] = [];
    let current = start;
    while (current <= end) {
      days.push(current);
      current = addDays(current, 1);
    }
    return days;
  }

  // 周视图：返回周开始到周结束
  getWeekRange() {
    return {
      start: startOfWeek(this.date, { weekStartsOn: this.config.weekStartsOn }),
      end: endOfWeek(this.date, { weekStartsOn: this.config.weekStartsOn }),
    };
  }

  // 日视图：返回24小时
  getDayHours() {
    return Array.from({ length: 24 }, (_, i) => i);
  }

  // 便捷跳转
  addMonth(n: number) {
    this.date = addMonths(this.date, n);
    return this.date;
  }

  addYear(n: number) {
    this.date = addYears(this.date, n);
    return this.date;
  }

  addDays(n: number) {
    this.date = addDays(this.date, n);
    return this.date;
  }

  setDate(d: Date) {
    this.date = d;
  }

  getDate() {
    return this.date;
  }

  getYear() {
    return this.date.getFullYear();
  }

  getTitle(viewMode: ViewMode, visibleDate: Date) {
    const currentDate = visibleDate;
    console.log('currentDate', currentDate);
    const locale = LOCALES[this.config.language] || zhCN;

    switch (viewMode) {
      case 'month':
        // 2025年3月
        return format(currentDate, 'yyyy年', { locale });

      case 'week': {
        const start = startOfWeek(currentDate, {
          weekStartsOn: this.config.weekStartsOn,
        });
        const end = endOfWeek(currentDate, {
          weekStartsOn: this.config.weekStartsOn,
        });

        // 同月：3月16日 – 22日
        if (start.getMonth() === end.getMonth()) {
          return `${format(start, 'M月d日', { locale })} – ${format(end, 'd日', { locale })}`;
        }

        // 跨月：3月28日 – 4月3日
        return `${format(start, 'M月d日', { locale })} – ${format(end, 'M月d日', { locale })}`;
      }

      case 'day':
        // 3月20日 星期四
        return format(currentDate, 'M月d日 EEEE', { locale });

      default:
        return '';
    }
  }
}
