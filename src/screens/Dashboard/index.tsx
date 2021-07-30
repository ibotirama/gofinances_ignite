import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useState } from "react";
import 'intl';
import { ActivityIndicator, Platform } from "react-native";
import "intl/locale-data/jsonp/pt-BR";

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LogoutButton,
  LoadContainer,
} from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

if (Platform.OS === "android") {
  // See https://github.com/expo/expo/issues/6536 for this issue.
  if (typeof (Intl as any).__disableRegExpRestore === "function") {
    (Intl as any).__disableRegExpRestore();
  }
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  incomes: HighlightProps;
  outcomes: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, SetTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);
  const dataKey = "@gofinances:transactions";

  const theme = useTheme();

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ) {
    const lastTransaction = new Date(
      Math.max.apply(Math, collection
        .filter(transaction => transaction.type === type)
        .map(transaction => new Date(transaction.date).getTime())))

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;
  }

  async function loadTransactions() {
    const response = await AsyncStorage.getItem(dataKey);
    const data = response ? JSON.parse(response) : [];

    let sumOfIncomes = 0;
    let sumOfOutcomes = 0;

    const transactionsFormatted: DataListProps[] = data.map((item: DataListProps) => {
      if (item.type === 'negative') {
        sumOfOutcomes += Number(item.amount);
      } else {
        sumOfIncomes += Number(item.amount);
      }

      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      const dateFormatted = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date: dateFormatted,
      }
    });

    SetTransactions(transactionsFormatted);
    console.log(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');
    const totalInterval = `01 a ${lastTransactionExpensives}`;

    let total = sumOfIncomes - sumOfOutcomes;
    setHighlightData({
      incomes: {
        amount: sumOfIncomes.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última entrada dia ${lastTransactionEntries}`,
      },
      outcomes: {
        amount: sumOfOutcomes.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última saída dia ${lastTransactionExpensives}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval
      }
    });
    setIsLoading(false);
  }

  async function deleteItems() {
    console.log('Deleting data...');
    await AsyncStorage.removeItem(dataKey);
  }

  useFocusEffect(useCallback(() => {
    loadTransactions();
    // deleteItems();
  }, []));

  return (
    <Container>
      {isLoading ?
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
        :
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{ uri: 'https://avatars.githubusercontent.com/u/565336?v=4' }}
                />
                <User>
                  <UserGreeting>Olá, </UserGreeting>
                  <UserName>Pedro</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={() => { }}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              title="Entrada"
              amount={highlightData.incomes.amount}
              lastTransaction={highlightData.incomes.lastTransaction}
              type="up"
            />
            <HighlightCard
              title="Saída"
              amount={highlightData.outcomes.amount}
              lastTransaction={highlightData.outcomes.lastTransaction}
              type="down"
            />
            <HighlightCard
              title="Total"
              amount={highlightData?.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
              type="total"
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionsList
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />

          </Transactions>
        </>
      }
    </Container>
  )
}
