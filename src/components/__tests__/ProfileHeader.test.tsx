import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileHeader from '../ProfileHeader';

describe('ProfileHeader', () => {
  const defaultProps = {
    username: 'TestUser',
    email: 'test@example.com',
    balance: 1000,
    casesOpened: 50,
    totalSpent: 5000,
    biggestWin: 2500,
    onLogout: vi.fn(),
  };

  it('должен отображать имя пользователя', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('TestUser')).toBeInTheDocument();
  });

  it('должен отображать email', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('должен отображать баланс', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('1000 ₽')).toBeInTheDocument();
  });

  it('должен отображать количество открытых кейсов', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('должен отображать потраченную сумму', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('5,000 ₽')).toBeInTheDocument();
  });

  it('должен отображать лучший выигрыш', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('2,500 ₽')).toBeInTheDocument();
  });

  it('должен вызывать onLogout при клике на кнопку выхода', async () => {
    const user = userEvent.setup();
    const onLogout = vi.fn();
    render(<ProfileHeader {...defaultProps} onLogout={onLogout} />);
    
    const logoutButton = screen.getByRole('button', { name: /выйти/i });
    await user.click(logoutButton);
    
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('должен отображать аватар если он передан', () => {
    render(<ProfileHeader {...defaultProps} avatar="https://example.com/avatar.jpg" />);
    const avatar = screen.getByRole('img', { name: 'TestUser' });
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('должен отображать первую букву имени если аватар не передан', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('должен отображать Steam ID и ссылку если они переданы', () => {
    render(<ProfileHeader {...defaultProps} steamId="76561198123456789" />);
    expect(screen.getByText(/Steam ID: 76561198123456789/i)).toBeInTheDocument();
    
    const steamLink = screen.getByRole('link');
    expect(steamLink).toHaveAttribute('href', 'https://steamcommunity.com/profiles/76561198123456789');
    expect(steamLink).toHaveAttribute('target', '_blank');
  });

  it('должен отображать бейджи статуса', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('Активен')).toBeInTheDocument();
    expect(screen.getByText('Проверенный')).toBeInTheDocument();
  });

  it('должен отображать бейдж Steam если steamId передан', () => {
    render(<ProfileHeader {...defaultProps} steamId="76561198123456789" />);
    expect(screen.getByText('Steam')).toBeInTheDocument();
  });
});
