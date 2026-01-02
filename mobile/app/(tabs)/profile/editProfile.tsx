import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Camera } from "lucide-react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker"

import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useState } from "react";
import { useUpdateUserProfile } from "@/hooks/useUpdateUserProfile";

export default function EditProfileScreen() {
  const router = useRouter();
  const {mutate: updateProfile, isPending} = useUpdateUserProfile();
  const [updatedUser, setUpdatedUser] = useState({
      firstName: '',
      lastName: '',
      username: '',
      avatar: ''
    })

    const pickAvatar = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if(!permission.granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        })

        if(!result.canceled) {
            setUpdatedUser(prev => ({...prev, avatar: result.assets[0].uri}))
        }
    }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* TOP BAR */}
      <View className="flex-row items-center px-6 py-4 border-b border-border">
        <Pressable onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={22} color="#a1a1aa" />
        </Pressable>
        <Text className="text-lg font-bold text-white tracking-tight">
          Edit Profile
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* AVATAR SECTION */}
        <View className="items-center mt-8 mb-10">
          <View className="relative">
            <View className="w-28 h-28 rounded-full overflow-hidden border-2 border-primary">
              <Image
                source={{ uri: updatedUser.avatar || "https://ui-avatars.com/api/?name=User" }}
                className="w-full h-full"
              />
            </View>

            {/* CHANGE AVATAR BUTTON */}
            <Pressable onPress={pickAvatar} className="absolute bottom-1 right-1 bg-primary p-2 rounded-full border-2 border-background">
              <Camera size={16} color="black" />
            </Pressable>
          </View>

          <Text className="text-zinc-500 text-xs mt-3 uppercase tracking-widest font-bold">
            Tap to change photo
          </Text>
        </View>

        {/* FORM SECTION */}
        <View className="gap-6 mb-10">
          <Input
            label="First Name"
            placeholder="Enter first name"
            value={updatedUser.firstName}
            onChangeText={(val) => setUpdatedUser(prev => ({...prev, firstName: val}))}
          />

          <Input
            label="Last Name"
            placeholder="Enter last name"
            value={updatedUser.lastName}
            onChangeText={(val) => setUpdatedUser(prev => ({...prev, lastName: val}))}
          />

          <Input
            label="Username"
            placeholder="Choose a username"
            autoCapitalize="none"
            value={updatedUser.username}
            onChangeText={(val) => setUpdatedUser(prev => ({...prev, username: val}))}
          />
        </View>

        {/* ACTIONS */}
        <View className="gap-3 mb-12">
          <Button disabled={isPending} onPress={() => {
                const payload: any = {};

                if(updatedUser.firstName.trim()) {
                    payload.firstName = updatedUser.firstName.trim();
                }

                if(updatedUser.lastName.trim()) {
                    payload.lastName = updatedUser.lastName.trim();
                }

                if(updatedUser.username.trim()) {
                    payload.username = updatedUser.username.trim();
                }

                if(updatedUser.avatar) {
                    payload.avatar = updatedUser.avatar;
                }

                updateProfile(payload, {
                  onSuccess: () => {
                    router.back();
                  }
                }); 
            }}>
            <Text className="text-black font-bold uppercase tracking-widest">
              {isPending ? "Saving..." : "Save Changes"}
            </Text>
          </Button>

          <Button variant="ghost" onPress={() => {router.back()}}>
            <Text className="uppercase tracking-widest text-xs">
              Cancel
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}