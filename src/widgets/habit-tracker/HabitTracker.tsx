import type { Habit } from '@/entities/habit/types';
import { useHabits } from '@/features/habit-management/hooks/useHabits';
import { Button } from '@/shared/ui/Button';
import { formatDate } from '@/shared/utils/date';
import { useState } from 'react';
import { HabitStats } from '../habit-stats/HabitStats';
import { Card } from '@/shared/ui/Card';
import { Calendar, Plus } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';
import { HabitForm } from '@/features/habit-management/components/HabitForm';
import { HabitList } from '@/features/habit-management/components/HabitList';

const HabitTracker: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const { habits, records, addHabit, deleteHabit, toggleHabit, getHabitStreak } = useHabits();

  const handleAddHabit = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    addHabit(habitData);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              {/* <h1 className="text-3xl font-bold text-gray-900">HabitTracker</h1> */}
              <p className="text-gray-600 mt-1">
                {formatDate(new Date())} • {habits.length} active habits
              </p>
            </div>
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 font-semibold">
              <Plus size={20} />
              Habit
            </Button>
          </div>
        </header>

        <HabitStats habits={habits} records={records} />

        <div className="space-y-4">
          {habits.length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No habits yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first habit and start tracking your progress
              </p>
              <Button onClick={() => setShowForm(true)}>Create your first habit</Button>
            </Card>
          ) : (
            <HabitList
              habits={habits}
              records={records}
              getHabitStreak={getHabitStreak}
              onToggle={toggleHabit}
              onDelete={deleteHabit}
            />
          )}
        </div>

        <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Create new habit">
          <HabitForm onSubmit={handleAddHabit} onCancel={() => setShowForm(false)} />
        </Modal>
      </div>
    </div>
  );
};

export default HabitTracker;
