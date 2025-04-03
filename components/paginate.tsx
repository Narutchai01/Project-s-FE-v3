import { FC } from "react";
import { View, FlatList } from "react-native";
import { Dot } from "lucide-react-native";
import { ImagePaginationProps } from "@/interface/paginate";

export const ImagePagination: FC<ImagePaginationProps> = (props) => {
  const { data, currImage } = props;

  return (
    <View
    style={{
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8, 
      marginTop: 10 }}
    >
      <FlatList
        data={data}
        horizontal
        renderItem={({ index }) => (
          <Dot
            size={24}
            color={index === currImage ? "red" : "gray"}
            style={{ marginHorizontal: 3 }}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};
