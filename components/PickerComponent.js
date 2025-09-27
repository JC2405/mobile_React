import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';

export default function PickerComponent({
  label,
  placeholder,
  value,
  onValueChange,
  items = [],
  displayKey = 'nombre',
  valueKey = 'id',
  showEspecialidad = false,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  // Asegurarse de que items sea un array
  const safeItems = Array.isArray(items) ? items : [];
  const selectedItem = safeItems.find(item => item && item[valueKey] === value);

  // Crear texto de display con especialidad si está disponible
  const getDisplayText = (item) => {
    if (!item) return placeholder;
    let text = item[displayKey];
    if (showEspecialidad && item.especialidad) {
      text += ` - ${item.especialidad}`;
    }
    return text;
  };

  const displayText = selectedItem ? getDisplayText(selectedItem) : placeholder;

  const renderItem = ({ item }) => {
    const itemText = showEspecialidad && item.especialidad
      ? `${item[displayKey]} - ${item.especialidad}`
      : item[displayKey];

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          onValueChange(item[valueKey]);
          setModalVisible(false);
        }}
      >
        <Text style={styles.itemText}>{itemText}</Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No hay opciones disponibles</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.picker}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.pickerText, !selectedItem && styles.placeholderText]}>
          {displayText}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar {label}</Text>
            <FlatList
              data={safeItems}
              renderItem={renderItem}
              keyExtractor={(item) => item[valueKey]?.toString() || Math.random().toString()}
              style={styles.list}
              ListEmptyComponent={renderEmptyList}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  picker: {
    borderWidth: 1.5,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F8F9FB',
    minHeight: 48,
    justifyContent: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: '#222',
  },
  placeholderText: {
    color: '#aaa',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  list: {
    maxHeight: 300,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemText: {
    fontSize: 16,
    color: '#374151',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});