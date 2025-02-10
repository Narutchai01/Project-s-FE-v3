import { FC } from "react";
import { Modal, Text, View } from "react-native";
import { RadioComponents } from "./Radio";
import { ButtonComponents } from "./Buntton";

interface PropsModalSensitiveSkin {
  isOpen: boolean;
  setSensitiveSkin: (sensitiveSkin: boolean) => void;
  onPres: () => void;
}

export const ModalSensitiveSkin: FC<PropsModalSensitiveSkin> = (props) => {
  const { isOpen, setSensitiveSkin,onPres } = props;
  return (
    <Modal visible={isOpen} animationType="slide">
      <View>
        <Text>Do you have sensitive facial skin?</Text>
        <RadioComponents setValue={setSensitiveSkin} />
        <ButtonComponents title="Save" onPress={onPres} />
      </View>
    </Modal>
  );
};
