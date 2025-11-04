import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileSettings from '../ProfileSettings';

describe('ProfileSettings', () => {
  const defaultProps = {
    username: 'TestUser',
    email: 'test@example.com',
    onSaveTradeUrl: vi.fn(),
  };

  it('должен отображать имя пользователя и email', () => {
    render(<ProfileSettings {...defaultProps} />);
    expect(screen.getByDisplayValue('TestUser')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('поля должны быть заблокированы по умолчанию', () => {
    render(<ProfileSettings {...defaultProps} />);
    expect(screen.getByDisplayValue('TestUser')).toBeDisabled();
    expect(screen.getByDisplayValue('test@example.com')).toBeDisabled();
  });

  it('должен активировать режим редактирования при клике на кнопку', async () => {
    const user = userEvent.setup();
    render(<ProfileSettings {...defaultProps} />);
    
    const editButton = screen.getByRole('button', { name: /редактировать/i });
    await user.click(editButton);
    
    expect(screen.getByDisplayValue('TestUser')).toBeEnabled();
    expect(screen.getByDisplayValue('test@example.com')).toBeEnabled();
  });

  it('должен показывать кнопки сохранения и отмены в режиме редактирования', async () => {
    const user = userEvent.setup();
    render(<ProfileSettings {...defaultProps} />);
    
    const editButton = screen.getByRole('button', { name: /редактировать/i });
    await user.click(editButton);
    
    expect(screen.getByRole('button', { name: /сохранить/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /отмена/i })).toBeInTheDocument();
  });

  it('должен отменять изменения при клике на отмену', async () => {
    const user = userEvent.setup();
    render(<ProfileSettings {...defaultProps} />);
    
    const editButton = screen.getByRole('button', { name: /редактировать/i });
    await user.click(editButton);
    
    const usernameInput = screen.getByDisplayValue('TestUser');
    await user.clear(usernameInput);
    await user.type(usernameInput, 'NewName');
    
    const cancelButton = screen.getByRole('button', { name: /отмена/i });
    await user.click(cancelButton);
    
    expect(screen.getByDisplayValue('TestUser')).toBeInTheDocument();
  });

  it('должен показывать форму Trade URL если не привязан', () => {
    render(<ProfileSettings {...defaultProps} />);
    expect(screen.getByText(/Привяжите Trade URL для вывода скинов/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/https:\/\/steamcommunity\.com\/tradeoffer/i)).toBeInTheDocument();
  });

  it('должен показывать привязанный Trade URL', () => {
    const tradeUrl = 'https://steamcommunity.com/tradeoffer/new/?partner=123456789&token=AbCdEfGh';
    render(<ProfileSettings {...defaultProps} tradeUrl={tradeUrl} />);
    
    expect(screen.getByText('Trade URL успешно привязан')).toBeInTheDocument();
    expect(screen.getByText(tradeUrl)).toBeInTheDocument();
  });

  it('должен показывать ошибку при пустом Trade URL', async () => {
    const user = userEvent.setup();
    render(<ProfileSettings {...defaultProps} />);
    
    const saveButton = screen.getByRole('button', { name: /сохранить trade url навсегда/i });
    await user.click(saveButton);
    
    expect(screen.getByText('Введите Trade URL')).toBeInTheDocument();
  });

  it('должен показывать ошибку при неверном формате Trade URL', async () => {
    const user = userEvent.setup();
    render(<ProfileSettings {...defaultProps} />);
    
    const input = screen.getByPlaceholderText(/https:\/\/steamcommunity\.com\/tradeoffer/i);
    await user.type(input, 'invalid-url');
    
    const saveButton = screen.getByRole('button', { name: /сохранить trade url навсегда/i });
    await user.click(saveButton);
    
    expect(screen.getByText(/Неверный формат Trade URL/i)).toBeInTheDocument();
  });

  it('должен сохранять валидный Trade URL', async () => {
    const user = userEvent.setup();
    const onSaveTradeUrl = vi.fn();
    render(<ProfileSettings {...defaultProps} onSaveTradeUrl={onSaveTradeUrl} />);
    
    const validUrl = 'https://steamcommunity.com/tradeoffer/new/?partner=123456789&token=AbCdEfGh';
    const input = screen.getByPlaceholderText(/https:\/\/steamcommunity\.com\/tradeoffer/i);
    await user.type(input, validUrl);
    
    const saveButton = screen.getByRole('button', { name: /сохранить trade url навсегда/i });
    await user.click(saveButton);
    
    expect(onSaveTradeUrl).toHaveBeenCalledWith(validUrl);
  });

  it('должен показывать сообщение об успехе после сохранения Trade URL', async () => {
    const user = userEvent.setup();
    render(<ProfileSettings {...defaultProps} />);
    
    const validUrl = 'https://steamcommunity.com/tradeoffer/new/?partner=123456789&token=AbCdEfGh';
    const input = screen.getByPlaceholderText(/https:\/\/steamcommunity\.com\/tradeoffer/i);
    await user.type(input, validUrl);
    
    const saveButton = screen.getByRole('button', { name: /сохранить trade url навсегда/i });
    await user.click(saveButton);
    
    expect(screen.getByText('Trade URL успешно сохранен!')).toBeInTheDocument();
  });

  it('должен очищать ошибку при изменении Trade URL', async () => {
    const user = userEvent.setup();
    render(<ProfileSettings {...defaultProps} />);
    
    const saveButton = screen.getByRole('button', { name: /сохранить trade url навсегда/i });
    await user.click(saveButton);
    
    expect(screen.getByText('Введите Trade URL')).toBeInTheDocument();
    
    const input = screen.getByPlaceholderText(/https:\/\/steamcommunity\.com\/tradeoffer/i);
    await user.type(input, 'test');
    
    await waitFor(() => {
      expect(screen.queryByText('Введите Trade URL')).not.toBeInTheDocument();
    });
  });

  it('должен отображать раздел изменения пароля', () => {
    render(<ProfileSettings {...defaultProps} />);
    expect(screen.getByText('Изменить пароль')).toBeInTheDocument();
    expect(screen.getByLabelText(/текущий пароль/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/новый пароль/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/подтвердите новый пароль/i)).toBeInTheDocument();
  });

  it('должен отображать опасную зону с кнопкой удаления аккаунта', () => {
    render(<ProfileSettings {...defaultProps} />);
    expect(screen.getByText('Опасная зона')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /удалить аккаунт/i })).toBeInTheDocument();
  });
});
