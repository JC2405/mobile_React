import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DatePickerComponent({
  label,
  placeholder,
  value,
  onChange,
  minimumDate,
  maximumDate,
}) {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(value ? new Date(value) : new Date());

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    setShow(Platform.OS === 'ios'); // En iOS mantener abierto, en Android cerrar
    if (selectedDate) {
      setDate(currentDate);
      // Formatear fecha como YYYY-MM-DD
      const formattedDate = currentDate.toISOString().split('T')[0];
      onChange(formattedDate);
    }
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return placeholder;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.datePicker}
        onPress={showDatepicker}
      >
        <Text style={[styles.dateText, !value && styles.placeholderText]}>
          {value ? formatDate(value) : placeholder}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}

      {show && Platform.OS === 'android' && (
        <View style={styles.androidButtons}>
          <TouchableOpacity
            style={styles.androidButton}
            onPress={() => setShow(false)}
          >
            <Text style={styles.androidButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.androidButton, styles.androidButtonConfirm]}
            onPress={() => {
              onChangeDate(null, date);
              setShow(false);
            }}
          >
            <Text style={[styles.androidButtonText, styles.androidButtonTextConfirm]}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginLeft: 2,
  },
  datePicker: {
    borderWidth: 1.5,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F8F9FB',
    minHeight: 48,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#222',
  },
  placeholderText: {
    color: '#aaa',
  },
  androidButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  androidButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  androidButtonConfirm: {
    backgroundColor: '#007BFF',
  },
  androidButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  androidButtonTextConfirm: {
    color: '#FFFFFF',
  },
});