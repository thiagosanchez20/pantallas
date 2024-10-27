import React, { useState } from "react";
import { View, Image, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation
import { db } from "../../firebaseconfig"; // Importar la configuración de Firebase
import { collection, addDoc } from "firebase/firestore";
import CryptoJS from 'crypto-js';
import CheckBox from 'expo-checkbox';
import fileImage from 'expo-router/assets/file.png';


function PaymentForm() {
  const navigation = useNavigation(); // Usa el hook useNavigation para obtener el objeto navigation

  const [cardType, setCardType] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [saveCard, setSaveCard] = useState(false); // Estado del checkbox para guardar tarjeta
  const [loading, setLoading] = useState(false);

  // Función para validar el formulario
  const validateForm = () => {
    if (!cardType || !cardNumber || !expiryDate || !cvv || !documentNumber) {
      Alert.alert("Todos los campos son obligatorios");
      return false;
    }
    if (cardNumber.length !== 16) {
      Alert.alert("El número de tarjeta debe tener 16 dígitos");
      return false;
    }
    if (cvv.length < 3 || cvv.length > 4) {
      Alert.alert("El CVV debe tener 3 o 4 dígitos");
      return false;
    }
    if (expiryDate.length !== 5 || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      Alert.alert("La fecha de vencimiento debe tener el formato MM/AA");
      return false;
    }
    return true;
  };

  // Función para confirmar antes de guardar
  const handleConfirm = () => {
    Alert.alert(
      "Confirmar Pago",
      `Tipo de Tarjeta: ${cardType}\nNúmero de Tarjeta: **** **** **** ${cardNumber.slice(-4)}\nFecha de Vencimiento: ${expiryDate}\nNúmero de Documento: ${documentNumber}`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: handleSubmit },
      ]
    );
  };

  // Función para guardar el pago en Firestore
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true); // Mostrar spinner
    const encryptedCardNumber = CryptoJS.AES.encrypt(cardNumber, 'your-secret-key').toString();
    const encryptedCvv = CryptoJS.AES.encrypt(cvv, 'your-secret-key').toString();

    const paymentData = {
      cardType,
      cardNumber: encryptedCardNumber,
      expiryDate,
      cvv: encryptedCvv,
      documentNumber,
    };

    try {
      // Guardar el pago en la colección "payments"
      await addDoc(collection(db, "payments"), paymentData);

      // Si el checkbox de "guardar tarjeta" está activado, guardamos la tarjeta en "savedCards"
      if (saveCard) {
        const savedCardData = {
          cardType,
          cardNumber: encryptedCardNumber,
          expiryDate,
          cvv: encryptedCvv,
          documentNumber,
        };

        await addDoc(collection(db, "savedCards"), savedCardData);
        Alert.alert("Pago realizado y tarjeta guardada para futuras compras.");
      } else {
        Alert.alert("Pago realizado con éxito.");
      }
    } catch (error) {
      Alert.alert("Error al guardar el pago:", error.message);
      console.log("Firebase error:", error); // Agregamos un log para ver el error exacto
    } finally {
      setLoading(false); // Ocultar spinner
    }
  };

  return (
    <View style={styles.container}>
      {/* Flecha para volver a la pantalla anterior */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Realizar Pago</Text>

      <Text style={styles.label}>Tarjeta crédito o débito:</Text>
      <View style={styles.cardImagesContainer}>
        <Image source={require('../../assets/images/mastercard.png')} style={styles.cardImage} />
        <Image source={require('../../assets/images/naranja_x.png')} style={styles.cardImage} />
        <Image source={require('../../assets/images/visa.png')} style={styles.cardImage} />
        <Image source={require('../../assets/images/credimas.png')} style={styles.cardImage} />
        <Image source={require('../../assets/images/cabal.png')} style={styles.cardImage} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Seleccione el tipo de tarjeta"
        value={cardType}
        onChangeText={setCardType}
        placeholderTextColor="#A9A9A9"
      />

      <Text style={styles.label}>Número de seguridad social (DNI / CUIT / CUIL):</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su número de documento"
        value={documentNumber}
        onChangeText={setDocumentNumber}
        keyboardType="numeric"
        placeholderTextColor="#A9A9A9"
      />

      <Text style={styles.label}>Número de la Tarjeta:</Text>
      <TextInput
        style={styles.input}
        placeholder="1234 5678 9012 3456"
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType="numeric"
        maxLength={16}
        placeholderTextColor="#A9A9A9"
      />

      {/* Nueva fila para Fecha de Vencimiento y CVV */}
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Fecha de Vencimiento:</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/AA"
            value={expiryDate}
            onChangeText={setExpiryDate}
            maxLength={5}
            placeholderTextColor="#A9A9A9"
          />
        </View>
        
        <View style={styles.column}>
          <Text style={styles.label}>Código de seguridad:</Text>
          <TextInput
            style={styles.input}
            placeholder="123"
            value={cvv}
            onChangeText={setCvv}
            keyboardType="numeric"
            maxLength={3}
            placeholderTextColor="#A9A9A9"
          />
        </View>
      </View>

      {/* Checkbox para guardar tarjeta */}
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={saveCard}
          onValueChange={setSaveCard}
        />
        <Text style={styles.label}>Guardar tarjeta para futuras compras</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Finalizar Pago" onPress={handleConfirm} style={styles.finalizar} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#404AA3',
  },
  backArrow: {
    width: 30,
    height: 30,
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    marginLeft: 87,
    color: 'white',
    marginBottom: 30,
  },
  label: {
    color: 'white',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  cardImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  cardImage: {
    width: 65,
    height: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribuir espacio entre las columnas
  },
  column: {
    flex: 1, // Las columnas ocupan el mismo espacio
    marginRight: 10, // Separación entre columnas
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 35,
    color: '#000',
    marginBottom: -35,
  },
});

export default PaymentForm;
