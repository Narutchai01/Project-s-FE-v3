import { Text, View } from "react-native";
import { Avatar } from "react-native-paper";
import { IAvatarTitle, IMapAvatar } from "@/interface/avatar";
import { FC } from "react";

export const AvatarText: FC<IAvatarTitle> = (props) => {
  const { title, image } = props;
  return (
    <View className="flex justify-center items-center">
      {image ? (
        <Avatar.Image size={56} source={{ uri: image }} />
      ) : (
        <Avatar.Text size={48} label={title.charAt(0)} />
      )}
      <Text>{title}</Text>
    </View>
  );
};


export const MapAvatar: FC<IMapAvatar> = (props) => {
  const { data } = props;
  return (
    <View className="flex-row">
      {data.map((item, index) => (
        <AvatarText key={index} title={item.title} image={item.image} />
      ))}
    </View>
  );
};