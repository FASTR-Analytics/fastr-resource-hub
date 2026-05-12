import { useState } from 'react'
import { Session, useWorkshopStore } from '../../stores/workshop'
import { t } from '../../i18n/translations'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Field } from '../../components/ui/Field'

interface EditSessionModalProps {
  session: Session
  dayNum: number
  totalDays: number
  onClose: () => void
  onSave: (updates: Partial<Session>) => void
  onDelete: () => void
  onMoveToDay: (toDay: number) => void
}

export function EditSessionModal({
  session,
  dayNum,
  totalDays,
  onClose,
  onSave,
  onDelete,
  onMoveToDay,
}: EditSessionModalProps) {
  const { contentLanguage } = useWorkshopStore()
  const [sessionName, setSessionName] = useState(session.session || '')
  const [speaker, setSpeaker] = useState(session.speaker || '')
  const [duration, setDuration] = useState(session.duration || 0)
  const [moveToDay, setMoveToDay] = useState<number | null>(null)

  const handleSave = () => {
    onSave({
      session: sessionName,
      speaker: speaker || undefined,
      duration,
    })
    onClose()
  }

  const handleDelete = () => {
    if (confirm(t('confirmDeleteSession', contentLanguage))) {
      onDelete()
      onClose()
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={t('editSession', contentLanguage)}
      size="md"
      footer={
        <div className="flex w-full items-center justify-between">
          <Button variant="ghost" onClick={handleDelete} className="text-red-600 hover:bg-red-50">
            {t('deleteSession', contentLanguage)}
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              {t('cancel', contentLanguage)}
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {t('saveChanges', contentLanguage)}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label={t('sessionName', contentLanguage)} htmlFor="es-name">
          <Input
            id="es-name"
            type="text"
            value={sessionName}
            onChange={e => setSessionName(e.target.value)}
            placeholder={t('sessionName', contentLanguage)}
          />
        </Field>

        <Field label={t('facilitatorPresenter', contentLanguage)} htmlFor="es-speaker">
          <Input
            id="es-speaker"
            type="text"
            value={speaker}
            onChange={e => setSpeaker(e.target.value)}
            placeholder="e.g., John Smith, MoH Team"
          />
        </Field>

        <Field label={t('durationMinutes', contentLanguage)} htmlFor="es-duration">
          <Input
            id="es-duration"
            type="number"
            value={duration}
            onChange={e => setDuration(parseInt(e.target.value) || 0)}
            min={0}
            step={5}
          />
        </Field>

        {totalDays > 1 && (
          <Field label={t('moveToDifferentDay', contentLanguage)} htmlFor="es-move">
            <div className="flex gap-2">
              <Select
                id="es-move"
                value={moveToDay ?? ''}
                onChange={e => setMoveToDay(e.target.value ? parseInt(e.target.value) : null)}
                className="flex-1"
              >
                <option value="">{t('selectDay', contentLanguage)}</option>
                {Array.from({ length: totalDays }, (_, i) => i + 1)
                  .filter(d => d !== dayNum)
                  .map(d => (
                    <option key={d} value={d}>
                      {t('day', contentLanguage)} {d}
                    </option>
                  ))}
              </Select>
              <Button
                variant="secondary"
                onClick={() => {
                  if (moveToDay) {
                    onMoveToDay(moveToDay)
                    onClose()
                  }
                }}
                disabled={!moveToDay}
              >
                {t('move', contentLanguage)}
              </Button>
            </div>
          </Field>
        )}
      </div>
    </Modal>
  )
}
