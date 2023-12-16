import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInputMask } from 'react-native-masked-text';
import { parse } from 'date-fns';
import styles from './AddExpenseForm.styles';

const AddExpenseForm = ({ navigation }) => {
  const [expenseName, setExpenseName] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  const handleAddExpense = async () => {
    try {
      // Validar os campos de entrada
      if (!expenseName.trim()) {
        throw new Error('O nome da despesa é obrigatório.');
      }

      if (!expenseAmount.trim()) {
        throw new Error('O valor da despesa é obrigatório.');
      }

      // Validar a data para garantir que seja uma data válida
      const parsedDate = parse(expenseDate, 'dd/MM/yyyy', new Date());

      if (isNaN(parsedDate)) {
        throw new Error('Data inválida. Por favor, insira uma data no formato dd/mm/aaaa.');
      }

      const currentYear = new Date().getFullYear();
      const expenseYear = parsedDate.getFullYear();

      if (expenseYear !== currentYear) {
        throw new Error(`Somente são permitidas despesas do ano corrente (${currentYear}).`);
      }

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
      if (error.message) {
        alert(error.message);
      } else {
        console.error('Erro ao adicionar despesa:', error);
      }
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

      <TextInputMask
        style={styles.input}
        placeholder="Data (DD/MM/YYYY)"
        type={'datetime'}
        options={{
          format: 'DD/MM/YYYY',
        }}
        value={expenseDate}
        onChangeText={(formattedDate) => {
          // Manter a data formatada no estado
          setExpenseDate(formattedDate);
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Valor da Despesa"
        onChangeText={(text) => setExpenseAmount(text)}
        value={expenseAmount}
        keyboardType="numeric"
      />

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

export default AddExpenseForm;
