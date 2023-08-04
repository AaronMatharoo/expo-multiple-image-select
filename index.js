import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

const MultipleImageUpload = ({
  imageWidth,
  imageHeight,
  round,
  selectedImages,
  onAdd,
  onDelete,
  DeleteIcon,
}) => {
  const [images, setImages] =
    useState < string[any] > (selectedImages ? selectedImages : []);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    if (Platform.OS === "ios") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need media library permissions to make this work!");
      } else {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          aspect: [4, 3],
          quality: 1,
          allowsMultipleSelection: true,
        });

        if (!result.canceled) {
          setIsLoading(true);
          const imageUris = result.assets.map((asset) => asset.uri);
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
          onAdd();
          setImages(imageUris);
        }
        console.log(images);
      }
    }
  };

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleDeleteImage = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
    onDelete();
  };

  const DeleteButton = ({ index }) => {
    return (
      <Box position={"absolute"} zIndex={1} right={3} top={3}>
        <Pressable
          backgroundColor={"red.500"}
          _pressed={{ backgroundColor: "red.700" }}
          p={2}
          rounded={"md"}
          onPress={() => handleDeleteImage(index)}
        >
          <DeleteIcon />
        </Pressable>
      </Box>
    );
  };

  return (
    <>
      <Button onPress={pickImage} p={2} rounded={"md"}>
        <HStack space={2} alignItems={"center"}>
          <Icon as={Feather} size={5} name="upload" color={"white"} />
          <Text color={"white"} fontWeight={"semibold"} fontSize={16}>
            Select Images
          </Text>
        </HStack>
      </Button>
      <Stack
        pt={3}
        w={"full"}
        alignItems={"center"}
        flexDirection={"row"}
        justifyContent={"center"}
        flexWrap={"wrap"}
      >
        <>
          {isLoading ? (
            <Spinner size="small" color={isDark ? "white" : "black"} />
          ) : (
            images?.map((image, i) => (
              <Box p={2} key={i}>
                <DeleteButton index={i} />
                <Image
                  key={i}
                  rounded={round ? "full" : "sm"}
                  alt="Uploaded Photo"
                  source={{ uri: image }}
                  style={{ width: imageWidth, height: imageHeight }}
                />
              </Box>
            ))
          )}
        </>
      </Stack>
    </>
  );
};

module.exports = {MultipleImageUpload}