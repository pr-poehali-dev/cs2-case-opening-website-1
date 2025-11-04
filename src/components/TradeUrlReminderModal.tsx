import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { soundManager } from '@/utils/sounds';

interface TradeUrlReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToProfile: () => void;
}

export default function TradeUrlReminderModal({
  isOpen,
  onClose,
  onGoToProfile,
}: TradeUrlReminderModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Icon name="AlertCircle" size={28} className="text-orange-400" />
            Trade URL не привязан
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-orange-900/20 border border-orange-500 rounded-lg p-4">
            <p className="text-sm text-gray-300 mb-3">
              Для вывода выигранных предметов необходимо привязать Steam Trade URL к вашему профилю.
            </p>
            <div className="space-y-2 text-xs text-gray-400">
              <p className="font-semibold">Как это сделать:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Перейдите в настройки профиля</li>
                <li>Найдите раздел "Steam Trade URL"</li>
                <li>Введите вашу Trade Offer URL из Steam</li>
              </ol>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-300">
                Trade URL привязывается один раз и не может быть изменен. Выигранные предметы будут автоматически отправлены на указанный адрес.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => {
                soundManager.playClick();
                onGoToProfile();
              }}
              onMouseEnter={() => soundManager.playHover()}
              className="flex-1 bg-neon-green hover:bg-neon-green/80 text-white font-bold"
            >
              <Icon name="Settings" size={18} className="mr-2" />
              Перейти в профиль
            </Button>
            <Button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              onMouseEnter={() => soundManager.playHover()}
              variant="outline"
              className="font-bold"
            >
              Позже
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
