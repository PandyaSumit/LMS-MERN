import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { GraduationCap } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import banner from "../../../public/loginBanner.jpg";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  function handleTabChange(value) {
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid() {
    return signInFormData?.userEmail !== "" && signInFormData?.password !== "";
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData?.userName !== "" &&
      signUpFormData?.userEmail !== "" &&
      signUpFormData?.password !== ""
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-12 h-16 flex items-center border-b bg-white shadow-sm">
        <Link to="/" className="flex items-center">
          <GraduationCap className="h-8 w-8 text-blue-600 mr-2" />
          <span className="font-extrabold text-xl text-gray-900">LMS</span>
        </Link>
      </header>

      <div className="flex min-h-screen">
        {/* Left Banner Section */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
          <img
            src={banner}
            alt="Education Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Authentication Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <Card className="p-6 space-y-4 shadow-lg">
                <CardHeader>
                  <CardTitle>Sign in to your account</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CommonForm
                    formControls={signInFormControls}
                    buttonText="Sign In"
                    formData={signInFormData}
                    setFormData={setSignInFormData}
                    isButtonDisabled={!checkIfSignInFormIsValid()}
                    handleSubmit={handleLoginUser}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card className="p-6 space-y-4 shadow-lg">
                <CardHeader>
                  <CardTitle>Create a new account</CardTitle>
                  <CardDescription>Fill in your details to get started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CommonForm
                    formControls={signUpFormControls}
                    buttonText="Sign Up"
                    formData={signUpFormData}
                    setFormData={setSignUpFormData}
                    isButtonDisabled={!checkIfSignUpFormIsValid()}
                    handleSubmit={handleRegisterUser}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;