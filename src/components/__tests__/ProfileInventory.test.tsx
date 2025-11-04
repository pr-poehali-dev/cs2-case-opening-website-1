import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileInventory from '../ProfileInventory';

describe('ProfileInventory', () => {
  const mockItems = [
    {
      id: '1',
      name: 'AK-47 | Редлайн',
      rarity: 'rare' as const,
      icon: '🔫',
      caseName: 'СЛЕНДЕР',
      price: 150,
      wonAt: Date.now(),
    },
    {
      id: '2',
      name: 'AWP | Азимов',
      rarity: 'legendary' as const,
      icon: '🎯',
      caseName: 'ДЖИНН',
      price: 1200,
      wonAt: Date.now(),
    },
  ];

  const defaultProps = {
    items: mockItems,
    hasTradeUrl: true,
    onSellItem: vi.fn(),
    onUseInContract: vi.fn(),
    onUseInUpgrade: vi.fn(),
    onWithdrawItem: vi.fn(),
    onRemoveItem: vi.fn(),
    onShowTradeUrlReminder: vi.fn(),
  };

  it('должен отображать общую статистику инвентаря', () => {
    render(<ProfileInventory {...defaultProps} />);
    expect(screen.getByText(/Всего предметов: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Общая стоимость: 1350 ₽/i)).toBeInTheDocument();
  });

  it('должен отображать все предметы', () => {
    render(<ProfileInventory {...defaultProps} />);
    expect(screen.getByText('AK-47 | Редлайн')).toBeInTheDocument();
    expect(screen.getByText('AWP | Азимов')).toBeInTheDocument();
  });

  it('должен отображать цены предметов', () => {
    render(<ProfileInventory {...defaultProps} />);
    expect(screen.getByText('150 ₽')).toBeInTheDocument();
    expect(screen.getByText('1200 ₽')).toBeInTheDocument();
  });

  it('должен отображать редкость предметов', () => {
    render(<ProfileInventory {...defaultProps} />);
    expect(screen.getByText('Редкая')).toBeInTheDocument();
    expect(screen.getByText('Легендарная')).toBeInTheDocument();
  });

  it('должен отображать название кейса', () => {
    render(<ProfileInventory {...defaultProps} />);
    expect(screen.getByText('СЛЕНДЕР')).toBeInTheDocument();
    expect(screen.getByText('ДЖИНН')).toBeInTheDocument();
  });

  it('должен показывать пустой инвентарь если предметов нет', () => {
    render(<ProfileInventory {...defaultProps} items={[]} />);
    expect(screen.getByText('Инвентарь пуст')).toBeInTheDocument();
    expect(screen.getByText('Откройте кейсы, чтобы получить предметы')).toBeInTheDocument();
  });

  it('должен вызывать onUseInContract при клике на кнопку контракта', async () => {
    const user = userEvent.setup();
    const onUseInContract = vi.fn();
    render(<ProfileInventory {...defaultProps} onUseInContract={onUseInContract} />);
    
    const contractButtons = screen.getAllByTitle('Использовать в контракте');
    await user.click(contractButtons[0]);
    
    expect(onUseInContract).toHaveBeenCalledWith('1');
  });

  it('должен вызывать onUseInUpgrade при клике на кнопку апгрейда', async () => {
    const user = userEvent.setup();
    const onUseInUpgrade = vi.fn();
    render(<ProfileInventory {...defaultProps} onUseInUpgrade={onUseInUpgrade} />);
    
    const upgradeButtons = screen.getAllByTitle('Использовать в апгрейде');
    await user.click(upgradeButtons[0]);
    
    expect(onUseInUpgrade).toHaveBeenCalledWith('1');
  });

  it('должен вызывать onSellItem и onRemoveItem при клике на кнопку продажи', async () => {
    const user = userEvent.setup();
    const onSellItem = vi.fn();
    const onRemoveItem = vi.fn();
    render(<ProfileInventory {...defaultProps} onSellItem={onSellItem} onRemoveItem={onRemoveItem} />);
    
    const sellButtons = screen.getAllByTitle('Продать');
    await user.click(sellButtons[0]);
    
    expect(onSellItem).toHaveBeenCalledWith(150);
    expect(onRemoveItem).toHaveBeenCalledWith('1');
  });

  it('должен вызывать onWithdrawItem если Trade URL привязан', async () => {
    const user = userEvent.setup();
    const onWithdrawItem = vi.fn();
    const onRemoveItem = vi.fn();
    render(<ProfileInventory {...defaultProps} hasTradeUrl={true} onWithdrawItem={onWithdrawItem} onRemoveItem={onRemoveItem} />);
    
    const withdrawButtons = screen.getAllByTitle('Вывести в Steam');
    await user.click(withdrawButtons[0]);
    
    expect(onWithdrawItem).toHaveBeenCalledWith('1');
    expect(onRemoveItem).toHaveBeenCalledWith('1');
  });

  it('должен показывать напоминание если Trade URL не привязан', async () => {
    const user = userEvent.setup();
    const onShowTradeUrlReminder = vi.fn();
    render(<ProfileInventory {...defaultProps} hasTradeUrl={false} onShowTradeUrlReminder={onShowTradeUrlReminder} />);
    
    const withdrawButtons = screen.getAllByTitle('Вывести в Steam');
    await user.click(withdrawButtons[0]);
    
    expect(onShowTradeUrlReminder).toHaveBeenCalled();
  });
});
