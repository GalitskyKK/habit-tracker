import React, { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import type { Habit, HabitRecord } from '@/entities/habit/types';
import { Calendar } from '@/components/ui/calendar';

interface HabitHistoryModalProps {
  open: boolean;
  onClose: () => void;
  habit: Habit;
  records: HabitRecord[];
  onToggle: (habitId: string, date: string) => void;
}

function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDateRangeArray(start: Date, end: Date): string[] {
  const arr = [];
  const current = new Date(start);

  while (current <= end) {
    arr.push(formatDateToString(current));
    current.setDate(current.getDate() + 1);
  }
  return arr;
}

export const HabitHistoryModal: React.FC<HabitHistoryModalProps> = ({
  open,
  onClose,
  habit,
  records,
  onToggle,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Блокировка скролла при открытии модалки
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Определяем диапазон дат для привычки
  const today = new Date();
  const habitStartDate = new Date(habit.createdAt);

  // Конечная дата привычки = дата создания + targetDays дней
  const habitEndDate = new Date(habitStartDate);
  habitEndDate.setDate(habitStartDate.getDate() + habit.targetDays - 1); // -1 потому что включаем день создания

  // Диапазон для редактирования: от создания до min(сегодня, конечная дата привычки)
  const editableEndDate = habitEndDate < today ? habitEndDate : today;

  // Получаем все дни в диапазоне привычки (от создания до планируемого окончания)
  const allHabitDates = getDateRangeArray(habitStartDate, habitEndDate);
  const allHabitDatesSet = new Set(allHabitDates);

  // Получаем дни доступные для редактирования (от создания до сегодня, но не позже окончания привычки)
  const editableDates = getDateRangeArray(habitStartDate, editableEndDate);
  const editableDatesSet = new Set(editableDates);

  // Получаем выполненные даты для этой привычки
  const habitRecords = records.filter((r) => r.habitId === habit.id);
  const completedDates = habitRecords.filter((r) => r.completed).map((r) => r.date);
  const completedDatesSet = new Set(completedDates);

  const todayStr = formatDateToString(today);
  const habitStartStr = formatDateToString(habitStartDate);
  const habitEndStr = formatDateToString(habitEndDate);

  const handleDayClick = (day: Date) => {
    const dateStr = formatDateToString(day);

    if (editableDatesSet.has(dateStr)) {
      console.log('Toggling day:', dateStr, 'for habit:', habit.id);
      onToggle(habit.id, dateStr);
    } else {
      console.log('Day not available for editing:', dateStr, {
        inHabitRange: allHabitDatesSet.has(dateStr),
        inEditableRange: editableDatesSet.has(dateStr),
        isAfterEnd: dateStr > habitEndStr,
        isBeforeStart: dateStr < habitStartStr,
      });
    }
  };

  // Stat
  const completedInRange = completedDates.filter((date) => allHabitDatesSet.has(date)).length;
  const totalDaysInRange = allHabitDates.length;
  const passedDays = getDateRangeArray(habitStartDate, editableEndDate).length;
  const missedDays = passedDays - completedInRange;

  // Check if the habit is completed
  const isHabitCompleted = today > habitEndDate;
  const progressPercentage =
    totalDaysInRange > 0 ? Math.round((completedInRange / totalDaysInRange) * 100) : 0;

  return (
    <Modal isOpen={open} onClose={onClose} title={`Habit: ${habit.name}`}>
      <div className="p-4 w-full h-full flex flex-col">
        {/* Статистика */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-4 gap-3 text-center text-sm">
            <div>
              <div className="text-xl font-bold text-green-600">{completedInRange}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-xl font-bold text-red-500">{missedDays}</div>
              <div className="text-xs text-gray-600">Skipped</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-600">{progressPercentage}%</div>
              <div className="text-xs text-gray-600">Progress</div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-600">{totalDaysInRange}</div>
              <div className="text-xs text-gray-600">Total days</div>
            </div>
          </div>

          {isHabitCompleted && (
            <div className="mt-2 text-center text-sm">
              <span
                className={`px-2 py-1 rounded-full text-white ${
                  progressPercentage >= 80
                    ? 'bg-green-500'
                    : progressPercentage >= 60
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}>
                Habit completed: {progressPercentage}% success
              </span>
            </div>
          )}
        </div>

        {/* Информация о диапазоне */}
        <div className="mb-4 text-xs text-gray-600 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
          <div className="font-semibold mb-1">Habit range:</div>
          <div>
            📅 Period: {habitStartStr} — {habitEndStr} ({totalDaysInRange} days)
          </div>
          <div>
            ✏️ Editable days: {habitStartStr} — {formatDateToString(editableEndDate)}
          </div>
          {isHabitCompleted && <div>✅ Habit completed</div>}
        </div>

        {/* Календарь */}
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            onDayClick={handleDayClick}
            showOutsideDays={true}
            modifiers={{
              // Выполненные дни в диапазоне привычки
              completed: (day) => {
                const dateStr = formatDateToString(day);
                return allHabitDatesSet.has(dateStr) && completedDatesSet.has(dateStr);
              },
              // Не выполненные дни в диапазоне привычки (доступные для редактирования)
              notCompleted: (day) => {
                const dateStr = formatDateToString(day);
                return editableDatesSet.has(dateStr) && !completedDatesSet.has(dateStr);
              },
              // Сегодняшний день
              today: (day) => {
                const dateStr = formatDateToString(day);
                return dateStr === todayStr;
              },
              // Все дни в диапазоне привычки (включая будущие планируемые)
              inHabitRange: (day) => {
                const dateStr = formatDateToString(day);
                return allHabitDatesSet.has(dateStr);
              },
              // Будущие дни привычки (еще не наступили, но в диапазоне)
              futureHabit: (day) => {
                const dateStr = formatDateToString(day);
                return allHabitDatesSet.has(dateStr) && dateStr > todayStr;
              },
              // Дни после завершения привычки
              afterHabit: (day) => {
                const dateStr = formatDateToString(day);
                return dateStr > habitEndStr;
              },
              // Дни до начала привычки
              beforeHabit: (day) => {
                const dateStr = formatDateToString(day);
                return dateStr < habitStartStr;
              },
              // Доступные для редактирования
              editable: (day) => {
                const dateStr = formatDateToString(day);
                return editableDatesSet.has(dateStr);
              },
            }}
            modifiersClassNames={{
              completed: 'relative hover:bg-gray-50 cursor-pointer',
              notCompleted: 'relative hover:bg-gray-50 cursor-pointer',
              today: 'relative hover:bg-gray-50 cursor-pointer',
              futureHabit: 'relative hover:bg-gray-50 cursor-pointer',
              afterHabit: 'text-gray-200 cursor-not-allowed opacity-30',
              beforeHabit: 'text-gray-200 cursor-not-allowed opacity-30',
              editable: 'cursor-pointer hover:bg-gray-50',
            }}
            modifiersStyles={{
              completed: {
                position: 'relative',
              },
              futureHabit: {
                position: 'relative',
              },
            }}
            className="rounded-lg border w-full max-w-2xl"
            components={{
              DayButton: (props) => {
                const dateStr = formatDateToString(props.day.date);
                const isCompleted = completedDatesSet.has(dateStr);
                const isAvailable = editableDatesSet.has(dateStr);
                const isToday = dateStr === todayStr;
                const isInHabitRange = allHabitDatesSet.has(dateStr);
                const isFuture = dateStr > todayStr;
                const isAfterEnd = dateStr > habitEndStr;
                const isBeforeStart = dateStr < habitStartStr;

                let circleBg = 'transparent';
                let circleBorder = '1px solid #e5e7eb';
                let circleTextColor = '#6b7280';
                let circleSize = 'w-6 h-6';

                if (isCompleted && isInHabitRange) {
                  circleBg = habit.color;
                  circleBorder = `1px solid ${habit.color}`;
                  circleTextColor = 'white';
                  circleSize = 'w-6 h-6';
                } else if (isAvailable && !isCompleted) {
                  circleBg = '#fef2f2';
                  circleBorder = '1px solid #fecaca';
                  circleTextColor = '#dc2626';
                  circleSize = 'w-6 h-6';
                } else if (isFuture && isInHabitRange) {
                  circleBg = '#f3f4f6';
                  circleBorder = '1px dashed #9ca3af';
                  circleTextColor = '#6b7280';
                  circleSize = 'w-6 h-6';
                } else if (isAfterEnd || isBeforeStart) {
                  circleBg = 'transparent';
                  circleBorder = '1px solid #e5e7eb';
                  circleTextColor = '#d1d5db';
                  circleSize = 'w-6 h-6';
                }

                return (
                  <button
                    {...props}
                    onClick={isAvailable ? () => handleDayClick(props.day.date) : undefined}
                    disabled={!isAvailable}
                    className={`w-full h-full p-1 flex items-center justify-center transition-all duration-200 hover:bg-gray-50 ${
                      isToday ? 'ring-2 ring-blue-400 ring-offset-1' : ''
                    }`}
                    title={
                      isToday
                        ? 'Today'
                        : isCompleted
                        ? 'Completed'
                        : isAvailable
                        ? 'Not completed'
                        : 'Unavailable'
                    }>
                    <div
                      className={`${circleSize} rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 transform hover:scale-110`}
                      style={{
                        backgroundColor: circleBg,
                        border: circleBorder,
                        color: circleTextColor,
                      }}>
                      {props.day.date.getDate()}
                    </div>
                  </button>
                );
              },
            }}
          />
        </div>

        {/* Легенда */}
        <div className="flex gap-3 items-center justify-center text-xs mb-4 mt-4 flex-wrap max-[370px]:hidden">
          <div className="flex items-center gap-1">
            <span
              className="w-4 h-4 rounded inline-block"
              style={{ backgroundColor: habit.color }}></span>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-red-100 border border-red-300 inline-block"></span>
            <span>Not completed</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-gray-100 border border-dashed border-gray-400 inline-block"></span>
            <span>Future days</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 rounded border-2 border-blue-400 inline-block"></span>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-gray-200 opacity-30 inline-block"></span>
            <span>Unavailable</span>
          </div>
        </div>

        {/* Подсказка */}
        <div className="text-center text-sm text-gray-600 mb-4 max-[370px]:hidden">
          <p>✨ Click on a day to change its status</p>
          <p className="text-xs mt-1">
            Editable days from {habitStartStr} to {formatDateToString(editableEndDate)}
          </p>
        </div>

        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors max-[370px]:mt-4">
          Close
        </button>
      </div>
    </Modal>
  );
};
