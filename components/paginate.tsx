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
      marginTop: 10 }}
    >
      <FlatList
        data={data}
        horizontal
        renderItem={({ index }) => (
          <Dot
            size={24}
            color={index === currImage ? "#FF6F61" : "#D3D3D3"}
            style={{ marginHorizontal: -8 }} 
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};
