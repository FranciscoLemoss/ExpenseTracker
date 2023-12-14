// Arquivo AddExpenseScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import DatePicker from 'react-native-datepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  datePicker: {
    width: '100%',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#4285F4',
  },
  backButton: {
    marginTop: 16,
  },
});

const AddExpenseScreen = ({ navigation }) => {
  const [expenseName, setExpenseName] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenseAmount, setExpenseAmount] = useState('');

  const handleAddExpense = async () => {
    try {
      const expense = {
        id: new Date().toISOString(),
        name: expenseName,
        date: expenseDate,
        amount: parseFloat(expenseAmount),
      };

      const existingExpenses = await AsyncStorage.getItem('expenses');
      const parsedExistingExpenses = existingExpenses ? JSON.parse(existingExpenses) : [];

      const updatedExpenses = [...parsedExistingExpenses, expense];

      await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));

      // Chame a função de atualizar as despesas diretamente da navegação
      navigation.setOptions({
        updateExpenses: () => fetchExpenses(), // Chame fetchExpenses para atualizar a lista
      });

      // Após adicionar a despesa, navegue de volta para a tela HomeScreen
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem('expenses');
      if (storedExpenses) {
        const parsedExpenses = JSON.parse(storedExpenses);
        setExpenses(parsedExpenses);
      }
    } catch (error) {
      console.error('Erro ao recuperar despesas:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Adicionar Despesa</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da Despesa"
        onChangeText={(text) => setExpenseName(text)}
        value={expenseName}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <DatePicker
          style={[styles.datePicker, { flex: 1, marginRight: 8 }]}
          date={expenseDate}
          mode="date"
          placeholder="Selecione a data"
          format="YYYY-MM-DD"
          minDate="2022-01-01"
          maxDate="2100-01-01"
          confirmBtnText="Confirmar"
          cancelBtnText="Cancelar"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 36,
            },
          }}
          onDateChange={(date) => setExpenseDate(date)}
        />

        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Valor da Despesa"
          onChangeText={(text) => setExpenseAmount(text)}
          value={expenseAmount}
          keyboardType="numeric"
        />
      </View>

      <Button
        style={styles.addButton}
        title="Adicionar Despesa"
        color="#4285F4"
        onPress={handleAddExpense}
      />

      <Button
        style={styles.backButton}
        title="Voltar para Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

export default AddExpenseScreen;
