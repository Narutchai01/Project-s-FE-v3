import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import React, { FC, useState } from "react";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs, { Dayjs } from "dayjs";

interface CalendarPickerProps {
  visible: boolean;
  onClose: () => void;
  onSave: (startDate: Dayjs | null, endDate: Dayjs | null) => void;
}

export const CalendarPicker: FC<CalendarPickerProps> = ({ visible, onClose, onSave }) => {
  const [range, setRange] = useState<{ startDate: Dayjs | null; endDate: Dayjs | null }>({
    startDate: null,
    endDate: null,
  });

  const handleSave = () => {
    onSave(range.startDate, range.endDate);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <DateTimePicker
            mode="range"
            startDate={range.startDate?.toDate()}
            endDate={range.endDate?.toDate()}
            onChange={({ startDate, endDate }) => {
              setRange({
                startDate: startDate ? dayjs(startDate) : null,
                endDate: endDate ? dayjs(endDate) : null,
              });
            }}
            selectedItemColor="#FF6F61"
            headerButtonColor="#FF6F61"
            headerTextStyle={{ color: "#FF6F61" }}
          />

          <View style={styles.footerModal}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text className="text-white text-lg font-bold">Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
  },
  footerModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#FF6F61",
    padding: 10,
    borderRadius: 10,
  },
  closeButton: {
    borderColor: "#848484",
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
  },
});
