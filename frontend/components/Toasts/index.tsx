import {useEffect} from 'react';
import {showNotification} from '@mantine/notifications';
import useToastStore from '../../stores/useToastStore';

const Toasts = () => {
  const toast = useToastStore(s => s.toast);
  const action = useToastStore(s => s.action);
  const clearToast = useToastStore(s => s.clearToast);

  useEffect(() => {
    if (toast) {
      showNotification({
        message: toast,
        action: action ? (
          <div onClick={clearToast} style={{cursor: 'pointer'}}>
            {action as React.ReactNode}
          </div>
        ) : undefined,
      });
    }
  }, [toast, action, clearToast]);

  return null;
};

export default Toasts;
