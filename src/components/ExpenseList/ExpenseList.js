import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { List, Divider, IconButton } from 'react-native-paper';
import styles from './ExpenseList.styles.js';

const ExpenseItem = ({ item, onDelete }) => (
  <View style={styles.listItem}>
    <List.Item
      title={`${item.name}`}
      description={`R$ ${item.amount.toFixed(2)} - Data: ${item.date}`}
    />
    <IconButton
      icon="delete"
      color="#FF0000"
      size={20}
      onPress={() => onDelete(item.id)}
    />
  </View>
);

export default ExpenseItem;
