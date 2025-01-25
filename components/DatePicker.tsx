import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import React, { FC, useState } from "react";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { ISignUp } from "@/interface/user";

interface DatePickerProps {
  visible: boolean;
  onClose: () => void;
  setSignupData: (data: ISignUp) => void;
  signupData: ISignUp;
}

export const DatePicker: FC<DatePickerProps> = (props) => {
  const { visible, onClose ,setSignupData,signupData} = props;
  const [date, setDate] = useState(dayjs());

const handleSave = () => {
    setSignupData({
      ...signupData,
      birthday: dayjs(date),
    });
    onClose();
};

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <DateTimePicker
            mode="single"
            date={date}
            onChange={(date) => {
              setDate(dayjs(date.date));
            }}
            selectedItemColor="#FF6F61"
            headerButtonColor="#FF6F61"
            headerTextStyle={{ color: "#FF6F61" }}
          />

          <View style={styles.footerModal}>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text className=" text-white text-lg font-bold">Save</Text>
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
    // backgroundColor: "red",
    width: "100%",
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
