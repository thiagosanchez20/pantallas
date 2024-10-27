import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../firebaseconfig'; 

// Datos de canchas
const canchaData = [
  { id: '1', nombre: 'Cancha 1', hora: '18:00pm', dia: '20/08/2024', disponible: true },
  { id: '2', nombre: 'Cancha 2', hora: '18:00pm', dia: '20/08/2024', disponible: false },
  { id: '3', nombre: 'Cancha 3', hora: '18:00pm', dia: '20/08/2024', disponible: true },
];

const PagoCancha = () => {
  const navigation = useNavigation();
  const [selectedCancha, setSelectedCancha] = useState(null);
  const [pagoRealizado, setPagoRealizado] = useState(null);

  const handleSelect = (cancha) => {
    setSelectedCancha(cancha);
  };

  const handleFinalizarPago = () => {
    if (pagoRealizado === null) {
      Alert.alert('Por favor, indique si se realizó el pago.');
      return;
    }
    Alert.alert('Pago realizado con éxito', `Seleccionaste ${selectedCancha.nombre}`);
    // Aquí puedes agregar la lógica para registrar el pago en Firestore usando db
  };

  const renderCancha = ({ item }) => (
    <TouchableOpacity
      style={[styles.canchaItem, item.disponible ? styles.disponible : styles.noDisponible]}
      onPress={() => item.disponible && handleSelect(item)}
      disabled={!item.disponible}
    >
      <Text style={styles.canchaText}>{item.nombre}</Text>
      <Text style={styles.horaText}>{item.hora}</Text>
      <Text style={styles.diaText}>{item.dia}</Text>
      {item.disponible && <Text style={styles.checkmark}>✅</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Pago de Cancha</Text>
      <FlatList
        data={canchaData}
        renderItem={renderCancha}
        keyExtractor={item => item.id}
      />

      <Text style={styles.question}>¿Se realizó el pago?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.pagoButton} onPress={() => setPagoRealizado(true)}>
          <Text style={styles.buttonText}>Sí</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pagoButton} onPress={() => setPagoRealizado(false)}>
          <Text style={styles.buttonText}>No</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.finalizarButton} onPress={handleFinalizarPago}>
        <Text style={styles.finalizarButtonText}>Finalizar pago</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#404AA3',
  },
  backButton: {
    color: 'black',
    fontSize: 24,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  canchaItem: {
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
  },
  disponible: {
    backgroundColor: '#140F07',
  },
  noDisponible: {
    backgroundColor: '#1A224C',
  },
  canchaText: {
    fontSize: 18,
    color: 'white',
  },
  horaText: {
    fontSize: 16,
    color: 'white',
  },
  diaText: {
    fontSize: 16,
    color: 'white',
  },
  checkmark: {
    fontSize: 18,
    color: 'white',
  },
  question: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  pagoButton: {
    backgroundColor: '#737BFD',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  finalizarButton: {
    backgroundColor: '#737BFD',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  finalizarButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default PagoCancha;
