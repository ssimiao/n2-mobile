import { StatusBar } from 'expo-status-bar';

import {
  Alert, TextInput, TouchableOpacity,
  View, Keyboard, Image, StyleSheet
} from 'react-native';
import { useState, useEffect } from 'react';
import { GluestackUIProvider, Button, ScrollView, ButtonText, Text, Box, Input, Center, InputField, VStack, HStack } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import * as DbCategoriaService from './DbCategoria';

export default function Categorias() {

  const [codigo, setCodigo] = useState();
  const [descricao, setDescricao] = useState();
  const [categorias, setCategorias] = useState([]);

  async function processamentoUseEffect() {
    try {      
      await DbCategoriaService.createTable();      
      await carregaDados();
    }
    catch (e) {
      console.log(e);
    }
  }

  useEffect(
    () => {
      processamentoUseEffect();
    }, []);


  function createUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(0, 2);
  }


  async function salvaDados() {
    let novoRegistro = (codigo == undefined);

    let obj = {
      codigo: novoRegistro ? createUniqueId() : codigo,
      descricao: descricao,
    };

    try {

      let resposta = false;
      console.log("chegou aqui")
      if (novoRegistro)
        resposta = await DbCategoriaService.adicionaCategoria(obj);
      else
        resposta = await DbCategoriaService.alteraCategoria(obj);

      if (resposta)
        Alert.alert('Sucesso!');
      else
        Alert.alert('Falha!');

      Keyboard.dismiss();
      limparCampos();
      await carregaDados();
    } catch (e) {
      Alert.alert(e);
    }
  }

  async function carregaDados() {
    try {
      console.log('carregando');
      let contatos = await DbCategoriaService.obtemTodasCategorias();
      setCategorias(contatos);
    } catch (e) {
      Alert.alert(e.toString());
    }
  }


  function editar(identificador) {
    const produto = categorias.find(produto => produto.codigo == identificador);

    if (produto != undefined) {
      setCodigo(produto.codigo);
      setDescricao(produto.descricao);
    }

    console.log(produto);
  }


  async function limparCampos() {
    setDescricao("");
    setValor("");
    setCodigo(undefined);
    Keyboard.dismiss();
  }


  async function efetivaExclusao() {
    try {
      await DbCategoriaService.excluiTodasCategorias();
      await carregaDados();
    }
    catch (e) {
      Alert.alert(e);
    }
  }

  function apagarTudo() {
    if (Alert.alert('Muita atenção!!!', 'Confirma a exclusão de todos os contatos?',
      [
        {
          text: 'Sim, confirmo!',
          onPress: () => {
            efetivaExclusao();
          }
        },
        {
          text: 'Não!!!',
          style: 'cancel'
        }
      ]));
  }


  function removerElemento(identificador) {
    Alert.alert('Atenção', 'Confirma a remoção do produto?',
      [
        {
          text: 'Sim',
          onPress: () => efetivaRemoverContato(identificador),
        },
        {
          text: 'Não',
          style: 'cancel',
        }
      ]);
  }

  async function efetivaRemoverContato(identificador) {
    try {
      console.log(identificador)
      await DbCategoriaService.excluiCategoria(identificador);
      Keyboard.dismiss();
      limparCampos();
      await carregaDados();
      Alert.alert('Produto apagado com sucesso!!!');
    } catch (e) {
      Alert.alert(e);
    }
  }


  return (
    <GluestackUIProvider config={config}>
      <Center mt={40}>
        <Text size='2xl' fontWeight="$bold">
          Quitanda
        </Text>
        <Text size='md' fontWeight="$bold">
          Categorias
        </Text>
      </Center>

      <Box mx={20}>

        <Box>
          <Text>Codigo</Text>
          <Input
            variant="outline"
            size="md"
            isDisabled={true}
            isInvalid={false}
            isReadOnly={true}
          >
            <InputField value={codigo} />
          </Input>
        </Box>

        <Box>
          <Text>Descrição</Text>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
          >
            <InputField onChangeText={(texto) => setDescricao(texto)} value={descricao} />
          </Input>
        </Box>

        <Button
          mt={5}
          size="md"
          variant="solid"
          action="primary"
          isDisabled={false}
          isFocusVisible={false}
          onPress={() => salvaDados()}
        >
          <ButtonText>Adiciona/Atualiza</ButtonText>
        </Button>

        <ScrollView mt={5} h='$80'>
        {
          categorias.map((categoria, index) => (
            <Box mt={5}>
              <HStack space='xs'>
                <Center>
                    <Box minWidth={270}>
                        <Text>Descrição: {categoria.descricao}</Text>
                    </Box>
                </Center>
                <Button
                  size="sm"
                  variant="solid"
                  action="primary"
                  isDisabled={false}
                  isFocusVisible={false}
                  onPress={() => removerElemento(categoria.codigo)}
                >
                  <ButtonText size='xs'>-</ButtonText>
                </Button>
                <Button
                  size="sm"
                  variant="solid"
                  action="primary"
                  isDisabled={false}
                  isFocusVisible={false}
                  onPress={() => editar(categoria.codigo)}
                >
                  <ButtonText size='xs'>+</ButtonText>
                </Button>
              </HStack>
            </Box>
          ))
        }

      </ScrollView>
      </Box>
    </GluestackUIProvider>
  );
}