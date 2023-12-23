import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export const Wrapper = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.blue};
`;

export const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  margin-top: 32px;
`;

export const botao = styled(TouchableOpacity)`
  width: 200px;
  height: 200px;
  background-color: pink;
`
