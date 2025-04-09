import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import useLoading from "@/hook/useLoading";
import LoadingIndicator from "@/components/Loading";
import { AxiosError } from "axios";
import { ConfirmAlert } from "@/components/Alert";
import { BackButtonComponents } from "@/components/Buntton";

export default function FaceScan() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const router = useRouter();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const handleError = (error: unknown) => {
    const axiosError = error as AxiosError;

    if (!alertVisible) {
      if (axiosError?.response?.status === 401) {
        setAlertMessage("Unauthorized. Please log in again.");
        setRedirectToLogin(true);
        setAlertVisible(true);
      } else if (axiosError?.response?.status === 500) {
        setAlertMessage(
          "Unable to process your face. Please retake the photo ensuring your face is clearly visible."
        );
        setRedirectToLogin(false);
        setAlertVisible(true);
      } else {
        setAlertMessage("Something went wrong. Please try again later.");
        setRedirectToLogin(false);
        setAlertVisible(true);
      }
    }
  };

  useEffect(() => {
    const requestPermission = async () => {
      startLoading();
      const { status } = await Camera.requestCameraPermissionsAsync();
      // console.log("Camera permission status:", status);
      setHasPermission(status === "granted");
      stopLoading();
    };

    requestPermission();
  }, []);

  const takePicture = async () => {
    try {
      if (cameraRef.current == null) {
        console.error("Camera reference is null.");
        return;
      }
      const photo = await cameraRef.current.takePictureAsync();

      if (!photo || !photo?.uri) {
        console.error("Failed to capture photo.");
        stopLoading();
        return;
      }

      console.log("Captured Photo:", photo?.uri);

      const formData = new FormData();
      const photoFile = {
        uri: photo?.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as unknown as Blob;

      formData.append("file", photoFile);

      startLoading();
      const token = await AsyncStorage.getItem("token");
      const response = await axiosInstance.post("/results", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: token,
        },
      });

      // console.log("Upload response:", response.data);
      router.push(`/diary/${response.data.data.id}`);
    } catch (error) {
      handleError(error);
      console.error("Failed to upload photo:", error);
    } finally {
      stopLoading();
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (hasPermission === null) {
    return (
      <Text className="text-center text-white">
        Requesting permission to use the camera...
      </Text>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-lg text-center">
          Please grant camera access from Settings.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="absolute top-0 left-0 right-0 h-16 z-10 bg-transparent px-6 pt-6">
        <View className="flex-row items-center justify-between">
          <BackButtonComponents
            title={"Camera"}
            textSize="text-Heading3 text-Quartz"
            onPress={() => router.back()}
          />
        </View>
      </View>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="front"
        onCameraReady={() => setIsCameraReady(true)}
      >
        <View className="absolute top-32 w-4/5 h-1/2 border-2 border-white rounded-full border-dashed self-center" />

        <TouchableOpacity
          className="absolute bottom-14 left-1/2 transform -translate-x-1/2"
          onPress={takePicture}
          disabled={isLoading}
        >
          <View
            className={`w-20 h-20 rounded-full border-4 ${
              isLoading ? "bg-gray-300" : "bg-white border-gray-400"
            }`}
          />
        </TouchableOpacity>

        <View className="absolute bottom-32 w-4/5 left-1/2 transform -translate-x-1/2">
          <Text className="text-white text-label4 font-bold text-center">
            Advice for Face Scanning
          </Text>
          <Text className="text-white text-center text-label4">
            1. Look at your face in a bright light.
          </Text>
          <Text className="text-white text-center text-label4">
            2. Choose a simple background.
          </Text>
          <Text className="text-white text-center text-label4">
            3. Make sure nothing is blocking your face.
          </Text>
          <Text className="text-white text-center text-label4">
            4. Make sure your face is in the allotted frame.
          </Text>
        </View>
      </CameraView>

      <ConfirmAlert
        visible={alertVisible}
        title={alertMessage}
        confirm={redirectToLogin ? "Back to login" : "OK"}
        onClose={() => {
          setAlertVisible(false);
          if (redirectToLogin) {
            router.replace("/login");
          }
        }}
      />
    </View>
  );
}
