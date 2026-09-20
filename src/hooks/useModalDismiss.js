import { useEffect } from 'react';

// Shared modal dismissal behavior (Jakob/Doherty): every dialog in the app closes
// on Escape and on outside mousedown, so dialogs behave consistently instead of
// each inventing its own close affordances.
//
// Usage: useModalDismiss(open, onClose, ref?) — pass a ref to the dialog panel to
// scope outside-click detection; omit it to close on any mousedown outside
// elements marked [data-modal-root].
const useModalDismiss = (open, onClose, panelRef) => {
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    const onMouseDown = (event) => {
      if (!(event.target instanceof Element)) return;
      if (panelRef?.current) {
        if (!panelRef.current.contains(event.target)) onClose();
      } else if (!event.target.closest('[data-modal-root]')) {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [open, onClose, panelRef]);
};

export default useModalDismiss;
