import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importamos el hook useNavigation

const Contrato = () => {
  const navigation = useNavigation(); 

  return (
    <View style={styles.container}>
      {/* Flecha para volver */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.titleBox}>
          <Text style={styles.title}>Términos y uso de privacidad</Text>
        </View>
      </View>

     
      <View style={styles.box}>
        <Text style={styles.boxText}>
          Gracias por completar tu registro en nuestra plataforma. Al hacerlo, 
          has aceptado los Términos de Uso y has dado tu consentimiento para el 
          procesamiento, tratamiento y transferencia de tus datos personales de 
          acuerdo con lo establecido en nuestras Políticas de Privacidad.
        </Text>
      </View>

      
      <View style={styles.box}>
        <Text style={styles.boxText}>
          Además, has optado por recibir boletines, promociones y otra información 
          relevante de Katriki Canchas y sus compañías afiliadas.
        </Text>
      </View>

     
      <View style={styles.box}>
        <Text style={styles.boxText}>
          Te invitamos a revisar nuevamente nuestros Términos de Uso y Políticas de 
          Privacidad para estar al tanto de cualquier actualización.
        </Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#404AA3',
    flex: 1, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 18,

  },
  backButtonText: {
    fontSize: 35,
    color: '#000',
    marginBottom: 15,
  },
  titleBox: {
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  box: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
  boxText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Contrato;
