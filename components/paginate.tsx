import { FC } from "react";
import { View, FlatList } from "react-native";
import { Dot } from "lucide-react-native";
import { ImagePaginationProps } from "@/interface/paginate";

export const ImagePagination: FC<ImagePaginationProps> = (props) => {
  const { data, currImage } = props;

  return (
    <View
      style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}
    >
      <FlatList
        data={data}
        horizontal
        renderItem={({ index }) => (
          <Dot
            size={30}
            color={index === currImage ? "red" : "gray"}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};
