import { StatusBar } from 'expo-status-bar';

import {
  Alert, TextInput, TouchableOpacity,
  View, Keyboard, ScrollView, StyleSheet, Image
} from 'react-native';
import { useState, useEffect } from 'react';
import { GluestackUIProvider, Button, ButtonText, Text, Box, Input, Center, InputField, VStack, HStack} from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import * as DbService from './DbProdutos';

export default function Home({ navigation }) {

  return (
    <GluestackUIProvider config={config}>
      <Center mt={40}>
        <Image
            src='https://ipfs.filebase.io/ipfs/Qma9cRdh7r5cBTW1F2ef6hswBrZtte1RXXBiGoJhzMpDqf'
            style={{
                  width: 250,
                  height: 200, //362 is actual height of image
                  resizeMode: 'stretch',
                }}

        />
        <Text mt={10} size='4xl' fontWeight="$bold">
          Quitanda
        </Text>
      </Center>

      <Box mx={20}>

        <Button
          mt={5}
          size="md"
          variant="solid"
          action="primary"
          isDisabled={false}
          isFocusVisible={false}
          onPress={() => navigation.navigate("Produto")}
        >
          <ButtonText>Gerenciamento de Produtos</ButtonText>
        </Button>

        <Button
          mt={5}
          size="md"
          variant="solid"
          action="primary"
          isDisabled={false}
          isFocusVisible={false}
          onPress={() => navigation.navigate("Venda")}
        >
          <ButtonText>Cadastro de Vendas</ButtonText>
        </Button>

        <Button
          mt={5}
          size="md"
          variant="solid"
          action="primary"
          isDisabled={false}
          isFocusVisible={false}
          onPress={() => navigation.navigate("ListaVenda")}
        >
          <ButtonText>Lista de Vendas</ButtonText>
        </Button>

        <Button
          mt={5}
          size="md"
          variant="solid"
          action="primary"
          isDisabled={false}
          isFocusVisible={false}
          onPress={() => navigation.navigate("Categoria")}
        >
          <ButtonText>Gerenciamento de Categorias</ButtonText>
        </Button>

      </Box>
    </GluestackUIProvider>
  );
}