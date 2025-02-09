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
      className="flex flex-row items-center justify-center rounded-full border-4 border-BrightGray p-6"
      onPress={googleSignIn}
    >
      <Image
        source={require("@/assets/images/google-logo.png")}
        width={350}
        height={350}
      />
      <Text>Login with Google</Text>
    </TouchableOpacity>
  );
};


export const BackButtonComponents: FC<BackButtonProps> = (props) => {
  const router = useRouter();
  const { title, textSize } = props;

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      className="mb-4 flex-row items-center"
    >
      <SquareArrowLeft size={28} color="black" />
      <Text className={textSize}>{title}</Text>
    </TouchableOpacity>
  );
}
