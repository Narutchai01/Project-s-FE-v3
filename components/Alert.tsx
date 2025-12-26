import React, { FC } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { LogoutConfirmAlertProps, ConfirmAlertProps } from "@/interface/Alert";

export const LogoutConfirmAlert: FC<LogoutConfirmAlertProps> = (props) => {
  const { visible, onClose, onConfirm, title, confirm, cancel } = props;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/30">
        <View className="w-[80%] bg-white rounded-xl overflow-hidden shadow-md">
          <View className="px-6 py-4 border-b border-gray-200">
            <Text className="text-center text-Heading4 text-black">
              {title}
            </Text>
          </View>

          <TouchableOpacity
            onPress={onConfirm}
            className="py-4 border-b border-gray-200"
          >
            <Text className="text-center text-label4 text-Bittersweet">
              {confirm}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} className="py-4">
            <Text className="text-center text-black font-medium text-label4">{cancel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export const ConfirmAlert: FC<ConfirmAlertProps> = ({
  visible,
  onClose,
  title,
  confirm,
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/30">
        <View className="w-[80%] bg-white rounded-xl overflow-hidden shadow-md">
      
          <View className="px-6 py-4 border-b border-gray-200">
            <Text className="text-center text-Heading4 text-black">
            {title}
            </Text>
          </View>

          <TouchableOpacity onPress={onClose} className="py-4">
            <Text className="text-center text-black font-medium text-label4">
            {confirm}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};