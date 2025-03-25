export interface LogoutConfirmAlertProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    confirm?: string;
    cancel?: string;
  }