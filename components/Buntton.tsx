import { Text, View, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { ButtonProps } from "@/interface/Button";
import { Image } from "react-native";

export const ButtonComponents: FC<ButtonProps> = (props) => {
  const { title, className ,textSize,onPress} = props;
  return (
    <TouchableOpacity className={className} onPress={onPress}>
      <Text className={textSize}>{title}</Text>
    </TouchableOpacity>
  );
};


export const GoogleButtonSignIn = () => {
  return (
    <TouchableOpacity className="flex flex-row items-center justify-center rounded-full border-4 border-BrightGray p-6">
      <Image
        source={require("@/assets/images/google-logo.png")}
        width={350}
        height={350}
      />
      <Text>Login with Google</Text>
    </TouchableOpacity>
  );
};