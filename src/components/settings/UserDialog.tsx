import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/settings";
import UserForm from "./UserForm";

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  user?: User | null;
  onSuccess: () => void;
}

const UserDialog: React.FC<UserDialogProps> = ({
  open,
  onClose,
  user,
  onSuccess,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {user ? "Editar Usuario" : "Nuevo Usuario"}
          </DialogTitle>
          <DialogDescription>
            {user
              ? "Modifica los datos del usuario"
              : "Completa la información para crear un nuevo usuario"}
          </DialogDescription>
        </DialogHeader>
        <UserForm
          user={user}
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;