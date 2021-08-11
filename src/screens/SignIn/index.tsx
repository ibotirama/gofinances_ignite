import React from 'react';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import theme from '../../global/styles/theme';
import { useAuth } from '../../hooks/auth';

import { SignInSocialButton } from '../../components/SignInSocialButton'

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from './styles';

export function SignIn() {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, signInWithApple } = useAuth();

  async function handleSignInWithGoogle() {
    try {
      setLoading(true);
      const response = await signInWithGoogle();
      setLoading(false);
      return response;
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível conectar a conta Google');
    }
  }

  async function handleSignInWithApple() {
    try {
      setLoading(true);
      const response = await signInWithApple();
      setLoading(false);
      return response;
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível conectar a conta Apple');
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />

          <Title>
            Controle suas {'\n'}
            finanças de forma {'\n'}
            muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com {'\n'}
          uma das contas abaixo
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
            enabled={!loading}
          />

          <SignInSocialButton
            title="Entrar com Apple"
            svg={AppleSvg}
            onPress={handleSignInWithApple}
            enabled={!loading}
          />

          {loading && (
            <ActivityIndicator
              style={{ marginTop: 18 }}
              color={theme.colors.shape}
              size="small"
            />
          )}
        </FooterWrapper>
      </Footer>
    </Container>
  );
}