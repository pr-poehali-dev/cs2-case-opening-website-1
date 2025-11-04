import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfileStats from '../ProfileStats';

describe('ProfileStats', () => {
  const defaultProps = {
    totalWinnings: 25000,
    totalSpent: 15000,
    casesOpened: 150,
    biggestWin: 8500,
    registeredDate: '15 октября 2024',
  };

  it('должен отображать общую статистику', () => {
    render(<ProfileStats {...defaultProps} />);
    expect(screen.getByText('Общая статистика')).toBeInTheDocument();
  });

  it('должен отображать всего выиграно', () => {
    render(<ProfileStats {...defaultProps} />);
    expect(screen.getByText('Всего выиграно:')).toBeInTheDocument();
    expect(screen.getByText('25,000 ₽')).toBeInTheDocument();
  });

  it('должен отображать всего потрачено', () => {
    render(<ProfileStats {...defaultProps} />);
    expect(screen.getByText('Всего потрачено:')).toBeInTheDocument();
    expect(screen.getByText('15,000 ₽')).toBeInTheDocument();
  });

  it('должен рассчитывать и отображать чистую прибыль', () => {
    render(<ProfileStats {...defaultProps} />);
    expect(screen.getByText('Чистая прибыль:')).toBeInTheDocument();
    expect(screen.getByText('10,000 ₽')).toBeInTheDocument();
  });

  it('должен показывать прибыль зеленым цветом если положительная', () => {
    const { container } = render(<ProfileStats {...defaultProps} />);
    const profitElement = screen.getByText('10,000 ₽');
    expect(profitElement.className).toContain('text-green-400');
  });

  it('должен показывать убыток красным цветом если отрицательный', () => {
    const { container } = render(
      <ProfileStats {...defaultProps} totalWinnings={5000} totalSpent={10000} />
    );
    const lossElement = screen.getByText('-5,000 ₽');
    expect(lossElement.className).toContain('text-red-400');
  });

  it('должен рассчитывать и отображать средний выигрыш', () => {
    render(<ProfileStats {...defaultProps} />);
    expect(screen.getByText('Средний выигрыш:')).toBeInTheDocument();
    const avgWin = Math.round(25000 / 150);
    expect(screen.getByText(`${avgWin.toLocaleString()} ₽`)).toBeInTheDocument();
  });

  it('должен отображать количество открытых кейсов', () => {
    render(<ProfileStats {...defaultProps} />);
    expect(screen.getByText('Открыто кейсов:')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('должен отображать лучший выигрыш', () => {
    render(<ProfileStats {...defaultProps} />);
    expect(screen.getByText('Лучший выигрыш:')).toBeInTheDocument();
    expect(screen.getByText('8,500 ₽')).toBeInTheDocument();
  });

  it('должен отображать информацию об аккаунте', () => {
    render(<ProfileStats {...defaultProps} />);
    expect(screen.getByText('Информация об аккаунте')).toBeInTheDocument();
  });

  it('должен отображать дату регистрации', () => {
    render(<ProfileStats {...defaultProps} />);
    expect(screen.getByText('Дата регистрации:')).toBeInTheDocument();
    expect(screen.getByText('15 октября 2024')).toBeInTheDocument();
  });

  it('должен отображать статус аккаунта', () => {
    render(<ProfileStats {...defaultProps} />);
    expect(screen.getByText('Статус:')).toBeInTheDocument();
    expect(screen.getByText('Активен')).toBeInTheDocument();
  });

  it('должен отображать статус верификации', () => {
    render(<ProfileStats {...defaultProps} />);
    expect(screen.getByText('Верификация:')).toBeInTheDocument();
    expect(screen.getByText('Подтвержден')).toBeInTheDocument();
  });

  it('должен отображать уровень пользователя', () => {
    render(<ProfileStats {...defaultProps} />);
    expect(screen.getByText('Уровень:')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('должен отображать опыт пользователя', () => {
    render(<ProfileStats {...defaultProps} />);
    expect(screen.getByText('Опыт:')).toBeInTheDocument();
    expect(screen.getByText('2,450 XP')).toBeInTheDocument();
  });

  it('должен отображать график активности', () => {
    render(<ProfileStats {...defaultProps} />);
    expect(screen.getByText('График активности')).toBeInTheDocument();
  });

  it('должен отображать месяцы на графике', () => {
    render(<ProfileStats {...defaultProps} />);
    expect(screen.getByText('Янв')).toBeInTheDocument();
    expect(screen.getByText('Июн')).toBeInTheDocument();
    expect(screen.getByText('Дек')).toBeInTheDocument();
  });

  it('должен отображать 12 столбцов графика', () => {
    const { container } = render(<ProfileStats {...defaultProps} />);
    const bars = container.querySelectorAll('[class*="from-orange-500"]');
    expect(bars).toHaveLength(12);
  });

  it('должен корректно форматировать большие числа', () => {
    render(<ProfileStats {...defaultProps} totalWinnings={1500000} totalSpent={500000} />);
    expect(screen.getByText('1,500,000 ₽')).toBeInTheDocument();
    expect(screen.getByText('500,000 ₽')).toBeInTheDocument();
  });

  it('должен обрабатывать нулевые значения', () => {
    render(<ProfileStats {...defaultProps} totalWinnings={0} totalSpent={0} casesOpened={1} />);
    expect(screen.getByText('0 ₽')).toBeInTheDocument();
  });
});
