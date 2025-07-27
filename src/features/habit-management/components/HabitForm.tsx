import { useState } from 'react';
import type { Habit } from '../../../entities/habit/types';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';

export const HabitForm: React.FC<{
  onSubmit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [targetDays, setTargetDays] = useState(7);

  const colors = [
    '#3B82F6',
    '#EF4444',
    '#10B981',
    '#F59E0B',
    '#8B5CF6',
    '#EC4899',
    '#06B6D4',
    '#84CC16',
  ];

  const handleSubmit = () => {
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      color,
      targetDays,
    });

    setName('');
    setDescription('');
    setColor('#3B82F6');
    setTargetDays(30);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Habit name</label>
        <Input value={name} onChange={setName} placeholder="For example: Exercise" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <Input
          value={description}
          onChange={setDescription}
          placeholder="Short habit description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
        <div className="flex gap-2">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full border-2 ${
                color === c ? 'border-gray-400' : 'border-gray-200'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Target (days)</label>
        <Input
          type="number"
          value={targetDays.toString()}
          onChange={(v) => setTargetDays(Number(v))}
          min="1"
          max="365"
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSubmit} className="flex-1">
          Create habit
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
