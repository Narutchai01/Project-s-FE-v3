import { FC } from "react";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import { RadioComponents } from "./Radio";
import { ButtonComponents } from "./Buntton";
import { SquareArrowLeft, Image as ImageIcon } from "lucide-react-native";
import { Image } from "expo-image";
import * as DocumentPicker from "expo-document-picker";
import { axiosInstance } from "@/lib/axios_instance";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import LoadingIndicator from "@/components/Loading";
import useLoading from "@/hook/useLoading";

interface PropsModalSensitiveSkin {
  isOpen: boolean;
  setSensitiveSkin: (sensitiveSkin: boolean) => void;
  onPres: () => void;
}

export const ModalSensitiveSkin: FC<PropsModalSensitiveSkin> = (props) => {
  const { isOpen, setSensitiveSkin, onPres } = props;
  return (
    <Modal visible={isOpen} animationType="slide">
      <View className="w-full h-full p-5 flex items-center justify-center gap-y-10">
        <Text className=" text-Heading3">
          Do you have sensitive facial skin?
        </Text>
        <RadioComponents setValue={setSensitiveSkin} />
        <ButtonComponents
          title="Save"
          onPress={onPres}
          className="bg-Bittersweet px-10 py-4 rounded-full"
          textSize="text-lg font-semibold text-White"
        />
      </View>
    </Modal>
  );
};

export const ModalCreateThread: FC<any> = (props) => {
  const router = useRouter();
  const { isOpen } = props;
  const { isLoading, startLoading, stopLoading } = useLoading();

  const [image, setImage] = useState<string[] | null>(null);
  const [thread, setThread] = useState({
    title: "",
    caption: "",
  });

  const handleChange = (key: string, value: string) => {
    setThread({ ...thread, [key]: value });
  };

  const handleChooseImage = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
      multiple: true,
    });

    if (result.canceled === false) {
      for (let i = 0; i < result.assets.length; i++) {
        setImage((prev) => {
          if (prev) {
            return [...prev, result.assets[i].uri];
          }
          return [result.assets[i].uri];
        });
      }
    }
  };

  const handleCreateThread = async () => {
    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const formData = new FormData();
      formData.append("title", thread.title);
      formData.append("caption", thread.caption);
      if (image) {
        image.forEach((img) => {
          const file = {
            uri: img,
            name: "image.jpg",
            type: "image/jpeg",
          };
          formData.append("files", file as unknown as Blob);
        });
      }
      await axiosInstance
        .post("/thread", formData, {
          headers: {
            token: token,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.status) {
            router.push(`/thread/${res.data.data.id}`);
          }
        });
    } catch (error) {
      console.log(error);
    } finally {
      stopLoading();
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide">
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ScrollView>
          <View className="h-16 bg-White">
            {/* header zone  */}
            <View className=" h-full flex-row items-center justify-between px-3">
              <TouchableOpacity className="flex flex-row gap-x-3 items-center">
                <SquareArrowLeft size={28} color="#4A4A4A" />
                <Text className="text-2xl font-semibold text-Quartz">
                  New Thread
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* header zone  */}

          <View className="flex justify-center items-center">
            <FlatList
              data={image}
              keyExtractor={(_, index: number) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              ListHeaderComponent={() => {
                return (
                  <TouchableOpacity
                    onPress={handleChooseImage}
                    style={{
                      height: 350,
                      width: 250,
                      borderRadius: 10,
                      borderColor: "black",
                      borderWidth: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 10, // Add gap between elements
                    }}
                  >
                    <View>
                      <ImageIcon size={100} color="#4A4A4A" />
                      <Text>Tap a photo</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              renderItem={({ item }: { item: string }) => (
                <Image
                  source={{ uri: item }}
                  style={{
                    width: 250,
                    height: 350,
                    borderRadius: 10,
                    marginTop: 10,
                    marginRight: 10, // Add gap between elements
                  }}
                />
              )}
            />
            <View className="w-full container mx-auto px-10 py-10 gap-y-4">
              <TextInput
                placeholder="Title"
                className=" border-2  w-full rounded-full p-6 border-BrightGray"
                onChangeText={(title) => handleChange("title", title)}
              />
              <TextInput
                placeholder="Add Caption"
                multiline
                style={{
                  minHeight: 100,
                  borderRadius: 30,
                }}
                className=" border-2  w-full  p-6 border-BrightGray"
                onChangeText={(caption) => handleChange("caption", caption)}
              />
            </View>
            <ButtonComponents
              title="Create Thread"
              onPress={handleCreateThread}
              className="bg-Bittersweet px-10 py-4 rounded-full"
              textSize="text-lg font-semibold text-White"
            />
          </View>
        </ScrollView>
      )}
    </Modal>
  );
};
