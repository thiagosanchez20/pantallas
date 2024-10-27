import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const UserProfile = () => {
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState({
    name: "Thiago Sanchez",
    phone: "+54 2991234567",
    dni: "12345678",
    email: "thiagosanchez@gmail.com",
    profileImageUrl: "",
  });

  const navigation = useNavigation();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Se necesitan permisos para acceder a la galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      const uri = result.uri;
      setImage(uri);
      await uploadImage(uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profilePictures/userId.jpg`);

      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      setUserData({ ...userData, profileImageUrl: downloadURL });
      Alert.alert("Imagen de perfil subida correctamente.");
    } catch (error) {
      Alert.alert("Error al subir la imagen", error.message);
    }
  };

  const deleteImage = async () => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profilePictures/userId.jpg`);

      await deleteObject(storageRef);
      setUserData({ ...userData, profileImageUrl: "" });
      setImage(null);
      Alert.alert("Imagen de perfil borrada correctamente.");
    } catch (error) {
      Alert.alert("Error al borrar la imagen", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={pickImage}>
          <MaterialIcons name="edit" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteImage}>
          <MaterialIcons name="delete" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={pickImage}>
        <View style={styles.profileImageContainer}>
          {image || userData.profileImageUrl ? (
            <Image
              source={{ uri: image || userData.profileImageUrl }}
              style={styles.profileImage}
            />
          ) : (
            <Text style={styles.placeholderText}>Foto de perfil</Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={pickImage}>
        <Text style={styles.editPhotoText}>Editar foto</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{userData.name}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{userData.phone}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{userData.email}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            <MaterialIcons name="lock" size={18} color="white" /> {userData.dni}
          </Text>
        </View>
      </View>

      <View style={styles.helpSection}>
        <Text style={styles.helpText}>{userData.helpSection}</Text>
        <Text style={styles.contactText}>{userData.contactNumber}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#404AA3',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
  buttonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderText: {
    color: 'white',
    fontSize: 18,
  },
  editPhotoText: {
    color: 'white',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  infoBox: {
    backgroundColor: '#575FCC',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  infoText: {
    color: 'white',
    fontSize: 18,
  },
  helpSection: {
    marginTop: 30,
    alignItems: 'center',
  },
  helpText: {
    color: 'white',
    fontSize: 18,
  },
  contactText: {
    color: 'white',
    fontSize: 16,
  },
  backButtonText: {
    fontSize: 35,
    color: '#000',
    marginBottom: -35,
  },
});

export default UserProfile;
