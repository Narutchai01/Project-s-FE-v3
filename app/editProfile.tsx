import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { BackButtonComponents, ButtonComponents } from "@/components/Buntton";
import { router } from "expo-router";
import { RadioComponents } from "@/components/Radio";
import { PencilLine } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import useLoading from "@/hook/useLoading";
import LoadingIndicator from "@/components/Loading";
import { IUser } from "@/interface/user";
import * as ImagePicker from "expo-image-picker";
import { DatePicker } from "@/components/DatePicker";
import dayjs from "dayjs";
import { ConfirmAlert } from "@/components/Alert";

export default function EditProfileScreen() {
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [image, setImage] = useState<string[] | null>(null);
  const [isSensitive, setIsSensitive] = useState<boolean | null>(null);
  const [user, setUser] = useState<IUser>({
    id: 0,
    password: "",
    full_name: "",
    birthday: null,
    email: "",
    sensitive_skin: null,
    image: "",
    follower: 0,
    following: 0,
  });
  const [birthday, setBirthday] = useState({ birthday: "" });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const defaultImage = require("@/assets/images/userDefault.jpg");
  const [showAlert, setShowAlert] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get("/user/me", {
        headers: { token },
      });
      const data = res.data;
      if (data.status) {
        const userData: IUser = data.data;
        setUser({
          id: userData.id,
          password: userData.password,
          email: userData.email,
          full_name: userData.full_name,
          birthday: userData.birthday,
          sensitive_skin: userData.sensitive_skin,
          image: userData.image,
          follower: userData.follower,
          following: userData.following,
        });
        setBirthday({ birthday: userData.birthday?.toString() || "" });
        setIsSensitive(userData.sensitive_skin);
        if (userData.image) {
          setImage([userData.image]);
        }
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage([result.assets[0].uri]);
    }
  };

  const handleChangeProfile = async () => {
    startLoading();
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const formData = new FormData();
      formData.append("fullname", user.full_name);
      formData.append("sensitiveskin", String(user.sensitive_skin));
      formData.append(
        "birthday",
        dayjs(user.birthday).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
      );

      for (let [key, value] of formData) {
        console.log(`${key}:`, value);
      }

      if (image && typeof image[0] === "string") {
        const file = {
          uri: image[0],
          name: "image.jpg",
          type: "image/jpeg",
        };
        formData.append("file", file as unknown as Blob);
      }

      await axiosInstance.put("/user", formData, {
        headers: {
          token,
          "Content-Type": "multipart/form-data",
        },
      });

      setShowAlert(true);
    } catch (error: any) {
      console.error("Update profile error:", error);
    } finally {
      stopLoading();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-Snow p-6">
      <ScrollView>
        {isLoading && <LoadingIndicator />}
        <View className="h-16 bg-Snow ">
          <BackButtonComponents
            title={"Edit Profile"}
            textSize="text-Heading3 text-Quartz"
            onPress={() => router.back()}
          />
        </View>

        <View className="px-4">
          <View className="items-center mb-6">
            <View className="relative">
              <Image
                source={
                  image && typeof image[0] === "string"
                    ? { uri: image[0] }
                    : defaultImage
                }
                className="w-28 h-28 rounded-full bg-gray-300"
              />

              <TouchableOpacity
                onPress={pickImage}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gray-200 items-center justify-center"
              >
                <PencilLine size={16} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-Heading4 text-Quartz mb-2">Username</Text>
          <TextInput
            value={user.full_name}
            onChangeText={(text) =>
              setUser((prev) => ({ ...prev, full_name: text }))
            }
            className="border-2 w-full rounded-full p-4 border-BrightGray mb-4"
          />

          <Text className="text-Heading4 text-Quartz mb-2">Birthday</Text>

          <TouchableOpacity
            className="border-2 w-full rounded-full p-4 border-BrightGray mb-4"
            onPress={() => setShowDatePicker(true)}
          >
            <Text>
              {user.birthday
                ? dayjs(user.birthday).format("DD/MM/YYYY")
                : "Birthday"}
            </Text>
          </TouchableOpacity>

          <DatePicker
            signupData={user}
            setSignupData={(updatedUser) => {
              setUser((prev) => ({
                ...prev,
                birthday: updatedUser.birthday,
              }));
            }}
            visible={showDatePicker}
            onClose={() => setShowDatePicker(false)}
          />

          <Text className="text-Heading4 text-Quartz mb-2">Email</Text>
          <TextInput
            value={user.email}
            onChangeText={(text) =>
              setUser((prev) => ({ ...prev, email: text }))
            }
            className="border-2 w-full rounded-full p-4 border-BrightGray mb-4"
          />

          <View className="flex flex-col gap-y-2 mb-10 mt-2">
            <Text>Do you have sensitive facial skin?</Text>
            <RadioComponents
              value={isSensitive}
              setValue={(value) => {
                setIsSensitive(value);
                setUser((prev) => ({
                  ...prev,
                  sensitive_skin: value,
                }));
              }}
            />
          </View>

          <ButtonComponents
            onPress={handleChangeProfile}
            title="Save"
            className="flex flex-row items-center justify-center rounded-full border-2 border-BrightGray p-4 bg-Bittersweet"
            textSize="text-white text-xl font-bold"
          />
        </View>

        <ConfirmAlert
          visible={showAlert}
          onClose={() => {
            setShowAlert(false);
            router.back();
          }}
          title="Profile updated successfully!"
          confirm="Done"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
