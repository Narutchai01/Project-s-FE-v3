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
import * as DocumentPicker from "expo-document-picker";
import { DatePicker } from "@/components/DatePicker";
import dayjs from "dayjs";
import { ConfirmAlert } from "@/components/Alert";
import { AxiosError } from "axios";

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
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleError = (error: unknown) => {
    const axiosError = error as AxiosError;
  
    if (axiosError?.response?.status === 401) {
      setAlertMessage("Unauthorized. Please log in again.");
      setAlertVisible(true);
    } else if (axiosError?.response?.status === 500) {
      setAlertMessage("This email is already in use.");
      setAlertVisible(true);
    }
  };
  

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
      handleError(error);
      console.error("Fetch profile error:", error);
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const pickImage = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
      multiple: false,
    });
  
    if (!result.canceled && result.assets[0].uri) {
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
      if (user.birthday) {
        formData.append(
          "birthday",
          dayjs(user.birthday).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        );
      }
      formData.append("email", user.email);

      if (image && typeof image[0] === "string" && !image[0].includes("http")) {
        formData.append("file", {
          uri: image[0],
          name: "image.jpg",
          type: "image/jpeg",
        } as any);
      }

      console.log("FormData:", formData);
      await axiosInstance.put("/user", formData, {
        headers: {
          token,
          "Content-Type": "multipart/form-data",
        },
      });

      setShowAlert(true);
    } catch (error: any) {
      handleError(error);
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
          <TouchableOpacity  onPress={pickImage} className="items-center mb-6">
            <View className="relative">
              <Image
                source={
                  image && typeof image[0] === "string"
                    ? { uri: image[0] }
                    : defaultImage
                }
                className="w-28 h-28 rounded-full bg-gray-300"
              />

              <View
               
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gray-200 items-center justify-center"
              >
                <PencilLine size={16} color="#000" />
              </View>
            </View>
          </TouchableOpacity>

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

        <ConfirmAlert
          visible={alertVisible}
          title={alertMessage}
          confirm="Back to login"
          onClose={() => {
            setAlertVisible(false);
            router.replace("/login");
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
