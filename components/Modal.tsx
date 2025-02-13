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
      <View className="w-full h-full p-5 flex items-center justify-center gap-y-10">
        <Text className=" text-Heading3">Do you have sensitive facial skin?</Text>
        <RadioComponents setValue={setSensitiveSkin} />
        <ButtonComponents title="Save" onPress={onPres} className="bg-Bittersweet px-10 py-4 rounded-full" textSize="text-lg font-semibold text-White"/>
      </View>
    </Modal>
  );
};
