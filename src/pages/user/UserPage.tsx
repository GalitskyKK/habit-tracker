import React, { useEffect, useState } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useAchievements, ACHIEVEMENTS } from '@/features/habit-management/hooks/useAchievements';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
// import { useNavigate } from 'react-router-dom';

const UserPage: React.FC = () => {
  const { user } = useAuth();
  const { fetchAchievements } = useAchievements();
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements' | 'stats'>('profile');
  const [userAchievements, setUserAchievements] = useState<{ [type: string]: string }>({});
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchAchievements();
      const map: { [type: string]: string } = {};
      data.forEach((a) => {
        map[a.type] = a.date_earned;
      });
      setUserAchievements(map);
      setLoading(false);
    };
    load();
  }, [fetchAchievements]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center">
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">You are not logged in</h2>
          <p>Please log in to view your profile.</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* <Header /> */}
      <div className="max-w-2xl mx-auto p-4">
        {/* <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => navigate('/')}>
              ← Back
            </Button>
            <h1 className="text-3xl font-bold">User Profile</h1>
          </div>
          <Button onClick={signOut}>Sign out</Button>
        </div> */}
        <div className="flex gap-4 mb-6">
          <Button
            className={`px-4 py-2 rounded-t-lg font-medium ${
              activeTab === 'profile' ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setActiveTab('profile')}>
            Profile Info
          </Button>
          <Button
            className={`px-4 py-2 rounded-t-lg font-medium ${
              activeTab === 'achievements' ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setActiveTab('achievements')}>
            Achievements
          </Button>
          <Button
            className={`px-4 py-2 rounded-t-lg font-medium ${
              activeTab === 'stats' ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setActiveTab('stats')}>
            Stats
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow p-6 min-h-[300px]">
          {activeTab === 'profile' && (
            <div>
              <div className="mb-4">
                <span className="font-semibold">Email:</span> {user.email}
              </div>
              <div className="mb-4">
                <span className="font-semibold">User ID:</span> {user.id}
              </div>
              {/* Можно добавить дату регистрации, если появится */}
            </div>
          )}
          {activeTab === 'achievements' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Achievements</h2>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ACHIEVEMENTS.map((a) => {
                    const unlocked = !!userAchievements[a.type];
                    return (
                      <Card
                        key={a.type}
                        className={`p-4 flex flex-col gap-2 ${
                          unlocked ? '' : 'opacity-50 grayscale'
                        }`}>
                        <div className="flex items-center gap-2">
                          {/* Можно добавить иконку/эмодзи */}
                          <span className="text-2xl">🏆</span>
                          <span className="font-semibold text-lg">{a.title}</span>
                        </div>
                        <div className="text-gray-700">{a.description}</div>
                        {unlocked && (
                          <div className="text-xs text-green-600 mt-2">
                            Unlocked: {new Date(userAchievements[a.type]).toLocaleDateString()}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {activeTab === 'stats' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Statistics</h2>
              {/* Здесь будет секция статистики */}
              <div className="text-gray-500">
                Coming soon: habit stats, streaks, check-ins, etc.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
