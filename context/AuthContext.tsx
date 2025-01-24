import { createContext, FC, ReactNode, useContext, useState } from "react";
import { ILogin, ISignUp } from "@/interface/user";
import { axiosInstance } from "@/lib/axios_instance";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  loginData: ILogin;
  setLoginData: (data: ILogin) => void;
  handleLogin: () => void;
  signupData: ISignUp;
  setSignupData: (data: ISignUp) => void;
  handleSignup: () => void;
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
        if (status === 201) {
          router.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const AuthContextValue = {
    loginData,
    setLoginData,
    handleLogin,
    signupData,
    setSignupData,
    handleSignup,
  };

  return (
    <AuthContext.Provider value={AuthContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
