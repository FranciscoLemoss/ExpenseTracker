import React, { useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { Button, List, Divider, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ExpenseItem from '../components/ExpenseItem/ExpenseItem';
import styles from './HomeScreen.styles';

const HomeScreen = ({ navigation, route }) => {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = useCallback(async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem('expenses');
      if (storedExpenses) {
        const parsedExpenses = JSON.parse(storedExpenses);
        // Ordena as despesas pela data, da maior para a menor
        parsedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
        setExpenses(parsedExpenses);
      }
    } catch (error) {
      console.error('Erro ao recuperar despesas:', error);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchExpenses();
    }, [fetchExpenses])
  );

  const handleDeleteExpense = async (id) => {
    try {
      const updatedExpenses = expenses.filter((expense) => expense.id !== id);

      await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));

      // Ordena as despesas pela data, da maior para a menor
      updatedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

      setExpenses(updatedExpenses);
    } catch (error) {
      console.error('Erro ao excluir despesa:', error);
    }
  };

  const navigateToAddExpense = () => {
    navigation.navigate('AddExpense', { updateExpenses: fetchExpenses });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ExpenseItem item={item} onDelete={handleDeleteExpense} />
        )}
        ItemSeparatorComponent={() => <Divider />}
      />

      <Button
        style={styles.addButton}
        icon="plus"
        mode="contained"
        onPress={navigateToAddExpense}
      >
        Adicionar Despesa
      </Button>
    </View>
  );
};

export default HomeScreen;
