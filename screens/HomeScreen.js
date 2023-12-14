import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Button, List, Divider, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listItem: {
    backgroundColor: '#fff',
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    marginVertical: 16,
    backgroundColor: '#4285F4',
  },
});

const HomeScreen = ({ navigation, route }) => {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = useCallback(async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem('expenses');
      if (storedExpenses) {
        const parsedExpenses = JSON.parse(storedExpenses);
        setExpenses(parsedExpenses);
      }
    } catch (error) {
      console.error('Erro ao recuperar despesas:', error);
    }
  }, []);

  useEffect(() => {
    fetchExpenses(); // Carregue as despesas ao inicializar o componente
  
    // Atualize a lista se houver uma atualização de despesas
    if (route.params?.updateExpenses) {
      fetchExpenses(); // Busque as despesas atualizadas
      route.params.updateExpenses(); // Resetar a flag de atualização
    }
  }, [fetchExpenses]);

  const handleDeleteExpense = async (id) => {
    try {
      const updatedExpenses = expenses.filter((expense) => expense.id !== id);

      await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));

      setExpenses(updatedExpenses);
    } catch (error) {
      console.error('Erro ao excluir despesa:', error);
    }
  };

  useEffect(() => {
    // Se houver uma atualização de despesas, atualize a lista
    if (route.params?.updateExpenses) {
      fetchExpenses();
      // Resetar a flag de atualização para evitar loop infinito
      route.params.updateExpenses();
    }
  }, [route.params?.updateExpenses, fetchExpenses]);

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <List.Item
              title={`${item.name} - ${item.description}`}
              description={`R$ ${item.amount.toFixed(2)} - Data: ${item.date}`}
            />
            <IconButton
              icon="delete"
              color="#FF0000"
              size={20}
              onPress={() => handleDeleteExpense(item.id)}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <Divider />}
      />

      <Button
        style={styles.addButton}
        icon="plus"
        mode="contained"
        onPress={() => navigation.navigate('AddExpense', { updateExpenses: fetchExpenses })}
      >
        Adicionar Despesa
      </Button>
    </View>
  );
};

export default HomeScreen;
