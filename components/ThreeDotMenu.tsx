import React, { useState } from "react";
import { View, TouchableOpacity, Modal, Text } from "react-native";
import { Ellipsis, PencilLine, Trash2 } from "lucide-react-native";
import { LogoutConfirmAlert } from "./Alert";
import { router } from "expo-router";

export const ThreeDotMenu = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  
  const handleEdit = () => {
    setModalVisible(false);
  };

  const handleDelete = () => {
    setModalVisible(false);
    setShowAlert(true);  
  };
  
  const handleDeleteConfirm = () => {
    setShowAlert(false);
    router.back();       
  };

  return (
    <View style={{ alignItems: "flex-end", padding: 10 }}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Ellipsis size={24} />
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-start items-end pt-24 pr-5 bg-black/10"
          onPress={() => setModalVisible(false)}
        >
          <View className="mr-2 mt-4 items-end">
            <View
              style={{
                width: 0,
                height: 0,
                backgroundColor: "transparent",
                borderStyle: "solid",
                borderLeftWidth: 8,
                borderRightWidth: 8,
                borderBottomWidth: 15,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderBottomColor: "white",
                marginRight: 4,
                marginBottom: -4,
                transform: [{ rotate: '20deg' }],
              }}
            />
            <View className="bg-white rounded-2xl py-2 w-44">
              <TouchableOpacity
                onPress={handleEdit}
                className="py-3 px-2 border-b border-BrightGray"
              >
                <View className="flex flex-row items-center gap-x-2">
                  <PencilLine size={20} color="black" />
                  <Text className="text-label11">Edit</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDelete} className="py-3 px-2">
                <View className="flex flex-row items-center gap-x-2">
                  <Trash2 size={20} color="black" />
                  <Text className="text-label11">Delete</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <LogoutConfirmAlert 
      visible={showAlert}
      onClose={() => setShowAlert(false)}
      onConfirm={handleDeleteConfirm}
      title="Confirm Delete ?"
      confirm="Delete"
      cancel="Cancel"
      />
    </View>
  );
};
