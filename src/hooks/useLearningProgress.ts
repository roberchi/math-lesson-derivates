import { useEffect, useRef } from 'react';
import { useDBStore } from '@/store/dbStore';
import { useProgressStore } from '@/store/progressStore';
import { useUIStore } from '@/store/uiStore';

export function useClassUnlocker() {
  const db = useDBStore((state) => state.db);
  const progress = useProgressStore((state) => state.progress);
  const initialize = useProgressStore((state) => state.initializeClasses);
  const unlock = useProgressStore((state) => state.unlockClass);
  const notify = useUIStore((state) => state.showSnackbar);
  const initialized = useRef(false);

  useEffect(() => {
    if (!db) return;
    initialize(db.classes.map((cls) => cls.id));
  }, [db, initialize]);

  useEffect(() => {
    if (!db) return;
    const unlockable = db.classes.filter(
      (cls) =>
        !progress.classes[cls.id]?.unlocked &&
        cls.prerequisite_classes.every((id) => progress.classes[id]?.mastered && progress.classes[id]?.unlocked),
    );
    unlockable.forEach((cls) => unlock(cls.id));
    if (initialized.current && unlockable.length) {
      notify(`🔓 Nuova classe sbloccata: ${unlockable[unlockable.length - 1].title.replace(/\\\((.*?)\\\)/g, '$1')}`);
    }
    initialized.current = true;
  }, [db, progress, unlock, notify]);
}
