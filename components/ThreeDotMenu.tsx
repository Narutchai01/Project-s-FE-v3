import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Text, StyleSheet } from 'react-native';
import { MoreVertical } from 'lucide-react-native'; 

const ThreeDotMenu = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleEdit = () => {
    setModalVisible(false);
    console.log('Edit clicked');
  };

  const handleDelete = () => {
    setModalVisible(false);
    console.log('Delete clicked');
  };

  return (
    <View style={{ alignItems: 'flex-end', padding: 10 }}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <MoreVertical size={24} />
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.menu}>
            <TouchableOpacity onPress={handleEdit} style={styles.menuItem}>
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.menuItem}>
              <Text style={{ color: 'red' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 50,
    paddingRight: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  menu: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 8,
    width: 120,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  menuItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default ThreeDotMenu;
