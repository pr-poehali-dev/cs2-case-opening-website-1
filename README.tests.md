# Unit Тесты для компонентов профиля

## Установка

Все необходимые зависимости уже установлены:
- `vitest` - тестовый фреймворк
- `@testing-library/react` - библиотека для тестирования React компонентов
- `@testing-library/jest-dom` - дополнительные матчеры для DOM
- `@testing-library/user-event` - симуляция действий пользователя
- `jsdom` - виртуальное DOM окружение
- `@vitest/ui` - UI для просмотра результатов тестов

## Запуск тестов

Добавьте в `package.json` следующие скрипты:

```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage"
}
```

### Команды:

```bash
# Запуск тестов в watch режиме
bun test

# Запуск тестов с UI интерфейсом
bun test:ui

# Запуск тестов с покрытием кода
bun test:coverage

# Разовый запуск всех тестов
bun test run
```

## Структура тестов

```
src/
├── components/
│   ├── __tests__/
│   │   ├── ProfileHeader.test.tsx        (14 тестов)
│   │   ├── ProfileInventory.test.tsx     (12 тестов)
│   │   ├── ProfileSettings.test.tsx      (15 тестов)
│   │   ├── ProfileOverview.test.tsx      (16 тестов)
│   │   └── ProfileStats.test.tsx         (18 тестов)
│   ├── ProfileHeader.tsx
│   ├── ProfileInventory.tsx
│   ├── ProfileSettings.tsx
│   ├── ProfileOverview.tsx
│   └── ProfileStats.tsx
└── test/
    └── setup.ts
```

## Покрытие тестами

### ProfileHeader (14 тестов)
- ✅ Отображение информации пользователя (имя, email, баланс)
- ✅ Отображение статистики (кейсы, траты, выигрыш)
- ✅ Работа кнопки выхода
- ✅ Отображение аватара или первой буквы
- ✅ Steam ID и ссылка на профиль
- ✅ Бейджи статуса

### ProfileInventory (12 тестов)
- ✅ Отображение списка предметов
- ✅ Статистика инвентаря
- ✅ Пустой инвентарь
- ✅ Действия с предметами (контракт, апгрейд, продажа, вывод)
- ✅ Проверка Trade URL перед выводом
- ✅ Напоминание о привязке Trade URL

### ProfileSettings (15 тестов)
- ✅ Редактирование профиля
- ✅ Режим редактирования (включение/выключение)
- ✅ Отмена изменений
- ✅ Привязка Trade URL
- ✅ Валидация Trade URL
- ✅ Отображение привязанного Trade URL
- ✅ Сообщения об ошибках и успехе
- ✅ Разделы смены пароля и удаления аккаунта

### ProfileOverview (16 тестов)
- ✅ Отображение последней активности
- ✅ Детали активности (название, результат, сумма, время)
- ✅ Отображение достижений
- ✅ Статус достижений (разблокировано/заблокировано)
- ✅ Визуальная индикация статуса
- ✅ Обработка пустых списков

### ProfileStats (18 тестов)
- ✅ Общая статистика (выигрыши, траты)
- ✅ Расчет чистой прибыли
- ✅ Цветовая индикация прибыли/убытка
- ✅ Средний выигрыш
- ✅ Информация об аккаунте
- ✅ График активности
- ✅ Форматирование больших чисел
- ✅ Обработка нулевых значений

## Всего: 75 unit тестов

## Конфигурация

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### src/test/setup.ts
```typescript
import '@testing-library/jest-dom';
```

## Примеры тестов

### Тестирование отображения
```typescript
it('должен отображать имя пользователя', () => {
  render(<ProfileHeader {...defaultProps} />);
  expect(screen.getByText('TestUser')).toBeInTheDocument();
});
```

### Тестирование взаимодействия
```typescript
it('должен вызывать onLogout при клике', async () => {
  const user = userEvent.setup();
  const onLogout = vi.fn();
  render(<ProfileHeader {...defaultProps} onLogout={onLogout} />);
  
  const logoutButton = screen.getByRole('button', { name: /выйти/i });
  await user.click(logoutButton);
  
  expect(onLogout).toHaveBeenCalledTimes(1);
});
```

### Тестирование валидации
```typescript
it('должен показывать ошибку при неверном формате', async () => {
  const user = userEvent.setup();
  render(<ProfileSettings {...defaultProps} />);
  
  const input = screen.getByPlaceholderText(/trade url/i);
  await user.type(input, 'invalid-url');
  
  const saveButton = screen.getByRole('button', { name: /сохранить/i });
  await user.click(saveButton);
  
  expect(screen.getByText(/Неверный формат/i)).toBeInTheDocument();
});
```

## Best Practices

1. **AAA Pattern** (Arrange-Act-Assert):
   - Arrange: подготовка данных и моков
   - Act: выполнение действия
   - Assert: проверка результата

2. **Тестируем поведение, а не реализацию**:
   - Проверяем что видит пользователь
   - Используем роли и тексты вместо классов

3. **Изолированность тестов**:
   - Каждый тест независим
   - Используем моки для зависимостей

4. **Читаемость**:
   - Понятные названия тестов
   - Описываем ожидаемое поведение

## CI/CD Integration

Тесты можно интегрировать в CI/CD pipeline:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun test run
```
