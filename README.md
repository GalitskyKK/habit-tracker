# 🏆 Vite Habit Tracker

A modern, fast, and beautiful habit tracker built with **React**, **Vite**, and **Supabase**.  
Track your habits, visualize your progress, and unlock achievements — all in a slick, responsive UI.

---

## 🚀 Features

- **Add, edit, and delete habits** — set your own goals and colors.
- **Daily tracking** — mark days as completed, see your streaks, and never miss a day.
- **Achievements** — unlock badges for consistency, streaks, and milestones.
- **Progress visualization** — weekly and monthly calendars, progress bars, and stats.
- **Authentication** — secure sign-up/sign-in with email or GitHub (powered by Supabase).
- **Responsive design** — works great on desktop and mobile.
- **Modern stack** — Vite, React, TypeScript, TailwindCSS, Supabase.

---

## 🛠️ Tech Stack

- **Frontend:** [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/), [TailwindCSS](https://tailwindcss.com/)
- **Backend/DB/Auth:** [Supabase](https://supabase.com/)
- **Icons:** [Lucide](https://lucide.dev/)
- **State & Architecture:** Feature-sliced design, custom hooks, strict typing

---

## 📦 Project Structure

```
src/
  app/                # App entry and layouts
  entities/           # Core types, utils, atomic components
  features/           # Business logic (habit management, tracking, achievements)
  shared/             # UI kit, hooks, utilities
  widgets/            # Page-level widgets (header, stats, tracker)
  pages/              # App pages (main, user)
  lib/                # Supabase client, helpers
```

---

## ✨ What You Can Do

- **Track unlimited habits** — create as many as you want, each with its own color and goal.
- **Visualize your journey** — see your progress on weekly/monthly calendars.
- **Stay motivated** — unlock achievements for your first habit, streaks, and more.
- **Secure your data** — all your habits and progress are safely stored in Supabase.
- **Customize** — easily extend with new features, themes, or integrations.

---

## 🧑‍💻 How to Run

1. **Clone the repo:**

   ```bash
   git clone https://github.com/your-username/vite-habit.git
   cd vite-habit
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   - Copy `.env.example` to `.env` and add your Supabase credentials.

4. **Start the dev server:**

   ```bash
   npm run dev
   ```

5. **Open [http://localhost:5173](http://localhost:5173) in your browser.**

---

## 🧩 Possible Improvements

- Habit reminders & notifications
- Social features (share progress, leaderboards)
- Dark mode & more themes
- Analytics dashboard
- PWA support (offline mode)
- Habit templates & suggestions

---

## 🤝 Contributing

Pull requests and ideas are welcome!  
Please open an issue or discussion for feedback, bugs, or feature requests.

---

## 📄 License

MIT

---

> Made with ❤️ using Vite, React, and Supabase.  
> Stay consistent. Build better habits. Unlock your potential!
