import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfileOverview from '../ProfileOverview';

describe('ProfileOverview', () => {
  const mockRecentActivity = [
    { type: 'case', name: 'СЛЕНДЕР', result: 'AWP | Азимов', value: 8500, time: '5 минут назад' },
    { type: 'upgrade', name: 'Апгрейд', result: 'Успешно', value: 2300, time: '1 час назад' },
    { type: 'contract', name: 'Контракт', result: 'AK-47 | Редлайн', value: 1850, time: '5 часов назад' },
  ];

  const mockAchievements = [
    { icon: '🎯', name: 'Первая победа', description: 'Открыли первый кейс', unlocked: true },
    { icon: '💎', name: 'Богач', description: 'Выиграли предмет дороже 10000₽', unlocked: true },
    { icon: '🔥', name: 'Везунчик', description: 'Открыли 100 кейсов', unlocked: false },
  ];

  it('должен отображать заголовок последней активности', () => {
    render(<ProfileOverview recentActivity={mockRecentActivity} achievements={mockAchievements} />);
    expect(screen.getByText('Последняя активность')).toBeInTheDocument();
  });

  it('должен отображать все записи активности', () => {
    render(<ProfileOverview recentActivity={mockRecentActivity} achievements={mockAchievements} />);
    expect(screen.getByText('СЛЕНДЕР')).toBeInTheDocument();
    expect(screen.getByText('Апгрейд')).toBeInTheDocument();
    expect(screen.getByText('Контракт')).toBeInTheDocument();
  });

  it('должен отображать результаты активности', () => {
    render(<ProfileOverview recentActivity={mockRecentActivity} achievements={mockAchievements} />);
    expect(screen.getByText('AWP | Азимов')).toBeInTheDocument();
    expect(screen.getByText('Успешно')).toBeInTheDocument();
    expect(screen.getByText('AK-47 | Редлайн')).toBeInTheDocument();
  });

  it('должен отображать значения выигрышей', () => {
    render(<ProfileOverview recentActivity={mockRecentActivity} achievements={mockAchievements} />);
    expect(screen.getByText('+8500 ₽')).toBeInTheDocument();
    expect(screen.getByText('+2300 ₽')).toBeInTheDocument();
    expect(screen.getByText('+1850 ₽')).toBeInTheDocument();
  });

  it('должен отображать время активности', () => {
    render(<ProfileOverview recentActivity={mockRecentActivity} achievements={mockAchievements} />);
    expect(screen.getByText('5 минут назад')).toBeInTheDocument();
    expect(screen.getByText('1 час назад')).toBeInTheDocument();
    expect(screen.getByText('5 часов назад')).toBeInTheDocument();
  });

  it('должен отображать заголовок достижений', () => {
    render(<ProfileOverview recentActivity={mockRecentActivity} achievements={mockAchievements} />);
    expect(screen.getByText('Достижения')).toBeInTheDocument();
  });

  it('должен отображать все достижения', () => {
    render(<ProfileOverview recentActivity={mockRecentActivity} achievements={mockAchievements} />);
    expect(screen.getByText('Первая победа')).toBeInTheDocument();
    expect(screen.getByText('Богач')).toBeInTheDocument();
    expect(screen.getByText('Везунчик')).toBeInTheDocument();
  });

  it('должен отображать описания достижений', () => {
    render(<ProfileOverview recentActivity={mockRecentActivity} achievements={mockAchievements} />);
    expect(screen.getByText('Открыли первый кейс')).toBeInTheDocument();
    expect(screen.getByText('Выиграли предмет дороже 10000₽')).toBeInTheDocument();
    expect(screen.getByText('Открыли 100 кейсов')).toBeInTheDocument();
  });

  it('должен отображать иконки достижений', () => {
    render(<ProfileOverview recentActivity={mockRecentActivity} achievements={mockAchievements} />);
    expect(screen.getByText('🎯')).toBeInTheDocument();
    expect(screen.getByText('💎')).toBeInTheDocument();
    expect(screen.getByText('🔥')).toBeInTheDocument();
  });

  it('должен показывать бейдж разблокировано для открытых достижений', () => {
    render(<ProfileOverview recentActivity={mockRecentActivity} achievements={mockAchievements} />);
    const unlockedBadges = screen.getAllByText('Разблокировано');
    expect(unlockedBadges).toHaveLength(2);
  });

  it('должен применять правильные стили для разблокированных достижений', () => {
    const { container } = render(<ProfileOverview recentActivity={mockRecentActivity} achievements={mockAchievements} />);
    const achievementCards = container.querySelectorAll('[class*="border-orange-500"]');
    expect(achievementCards.length).toBeGreaterThan(0);
  });

  it('должен применять правильные стили для заблокированных достижений', () => {
    const { container } = render(<ProfileOverview recentActivity={mockRecentActivity} achievements={mockAchievements} />);
    const lockedCards = container.querySelectorAll('[class*="opacity-50"]');
    expect(lockedCards.length).toBeGreaterThan(0);
  });

  it('должен обрабатывать пустой список активности', () => {
    render(<ProfileOverview recentActivity={[]} achievements={mockAchievements} />);
    expect(screen.getByText('Последняя активность')).toBeInTheDocument();
  });

  it('должен обрабатывать пустой список достижений', () => {
    render(<ProfileOverview recentActivity={mockRecentActivity} achievements={[]} />);
    expect(screen.getByText('Достижения')).toBeInTheDocument();
  });
});
