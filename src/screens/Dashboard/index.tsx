import React from "react";

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
} from "./styles";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const data: DataListProps[] = [{
    id: '1',
    type: 'positive',
    title: "Desenvolvimento de site",
    amount: "R$ 10.000,00",
    category: {
      name: 'Vendas',
      icon: 'dollar-sign'
    },
    date: "13/04/2020",
  },
  {
    id: '2',
    type: "negative",
    title: "Aluguel",
    amount: "R$ 1.200,00",
    category: {
      name: 'Casa',
      icon: 'shopping-bag'
    },
    date: "13/04/2020",
  },
  {
    id: '31',
    type: "negative",
    title: "Hamburgueria Pizzy",
    amount: "R$ 59,00",
    category: {
      name: 'Alimentação',
      icon: 'coffee'
    },
    date: "13/04/2020",
  }
  ];

  return (
    <Container>
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

          <LogoutButton onPress={() => {}}>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard
          title="Entrada"
          amount="R$ 17.000,00"
          lastTransaction="Última entrada 13 de abril"
          type="up"
        />
        <HighlightCard
          title="Saída"
          amount="R$ 1.529,00"
          lastTransaction="Última saída 03 de abril"
          type="down"
        />
        <HighlightCard
          title="Total"
          amount="R$ 16.141,00"
          lastTransaction="01 a 16 de abril"
          type="total"
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionsList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />

      </Transactions>
    </Container>
  )
}
