import { createContext, FC, ReactNode, useContext, useState } from "react";
import { ILogin, ISignUp } from "@/interface/user";
import { axiosInstance } from "@/lib/axios_instance";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

type AuthContextType = {
  loginData: ILogin;
  setLoginData: (data: ILogin) => void;
  handleLogin: () => void;
  signupData: ISignUp;
  setSignupData: (data: ISignUp) => void;
  handleSignup: () => void;
  googleSignIn: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [loginData, setLoginData] = useState<ILogin>({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState<ISignUp>({
    full_name: "",
    birthday: null,
    email: "",
    password: "",
    sensitive_skin: false,
  });

  const handleLogin = async () => {
    await axiosInstance
      .post("/user/login", loginData)
      .then(async (res) => {
        const status = res.status;

        if (status !== 200) {
          return;
        }
        const token: string = res.data.data.token;
        await AsyncStorage.setItem("token", token);
        console.log("login suc");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSignup = async () => {
    await axiosInstance
      .post("/user/register", signupData)
      .then((res) => {
        const status = res.status;
        setSignupData({
          full_name: "",
          birthday: null,
          email: "",
          password: "",
          sensitive_skin: false,
        });
        if (status === 201) {
          router.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],

  });

  const googleSignIn = async () => {
  
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      // setUserInfo(userInfo);
    } catch (error) {
      if ((error as any).code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log("cancelled");
      } else if ((error as any).code === statusCodes.IN_PROGRESS) {
        console.log("in progress");
      } else if ((error as any).code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("play services not available or outdated");
      } else {
        console.log("Something went wrong", error);
      }
    }
  };


  const AuthContextValue = {
    loginData,
    setLoginData,
    handleLogin,
    signupData,
    setSignupData,
    handleSignup,
    googleSignIn,
  };

  return (
    <AuthContext.Provider value={AuthContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
