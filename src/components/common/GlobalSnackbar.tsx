import { Alert, Snackbar } from '@mui/material';
import { useUIStore } from '@/store/uiStore';

export function GlobalSnackbar() {
  const snackbar = useUIStore((state) => state.snackbar);
  const hide = useUIStore((state) => state.hideSnackbar);
  return (
    <Snackbar open={snackbar.open} autoHideDuration={2800} onClose={hide} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Alert severity={snackbar.severity} variant="filled" onClose={hide} sx={{ minWidth: 280 }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}
