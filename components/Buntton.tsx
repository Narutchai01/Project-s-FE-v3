import { Text, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { ButtonProps } from "@/interface/Button";
import { Image } from "react-native";
import { SquareArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { BackButtonProps } from "@/interface/Button";

export const ButtonComponents: FC<ButtonProps> = (props) => {
  const { title, className, textSize, onPress } = props;
  return (
    <TouchableOpacity className={className} onPress={onPress}>
      <Text className={textSize}>{title}</Text>
    </TouchableOpacity>
  );
};

export const GoogleButtonSignIn = ({
  googleSignIn,
}: {
  googleSignIn: () => void;
}) => {
  return (
    <TouchableOpacity
      className="flex flex-row items-center justify-center rounded-full border-2 border-BrightGray p-6"
      onPress={googleSignIn}
    >
      <Image
        source={require("@/assets/images/google-logo.png")}
        width={350}
        height={350}
      />
      <Text className="ml-4">Login with Google</Text>
    </TouchableOpacity>
  );
};


export const BackButtonComponents: FC<BackButtonProps> = (props) => {
  const { title, textSize, onPress } = props;

  return (
    <TouchableOpacity onPress={onPress} className="mb-4 flex-row items-center gap-x-4">
      <SquareArrowLeft size={28} color="#4A4A4A" />
      <Text className={textSize}>{title}</Text>
    </TouchableOpacity>
  );
}
