import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDBStore } from '@/store/dbStore';
import type { DifficultyLevel } from '@/types/exercise';

export function DifficultyChip({ level }: { level: DifficultyLevel }) {
  const { t } = useTranslation();
  const info = useDBStore((state) => state.db?.difficulty_levels[String(level)]);
  const fallback = t(`difficulty.${level}`);
  const colors = ['#13795B', '#4158D0', '#B65C14', '#7448C8'];
  const color = info?.color ?? colors[level - 1];
  return (
    <Chip
      size="small"
      label={info?.label ?? fallback}
      sx={{ color, border: `1px solid ${color}55`, bgcolor: `${color}12` }}
    />
  );
}
