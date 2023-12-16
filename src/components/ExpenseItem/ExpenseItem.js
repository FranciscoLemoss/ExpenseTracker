import React from 'react';
import { View, Text } from 'react-native';
import { List, IconButton } from 'react-native-paper';
import styles from './ExpenseItem.styles';

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
