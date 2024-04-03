import { StatusBar } from 'expo-status-bar';

import {
  Alert, TextInput, TouchableOpacity,
  View, Keyboard, ScrollView, Image, StyleSheet
} from 'react-native';
import { useState, useEffect } from 'react';
import { GluestackUIProvider, Button, ButtonText, Text, Box, Input, Center, InputField, VStack, HStack, Select, SelectTrigger, SelectInput, SelectIcon, Icon, ChevronDownIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import * as DbService from './DbProdutos';
import * as DbCategoriaService from './DbCategoria';

import { SelectItem } from '@gluestack-ui/themed';

export default function Produtos() {

  const [codigo, setCodigo] = useState();
  const [descricao, setDescricao] = useState();
  const [valor, setValor] = useState();
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [idCategoria, setIdCategoria] = useState();
  const [nomeCategoria, setNomeCategoria] = useState();

  async function processamentoUseEffect() {
    try {      
      await DbService.createTable();
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
      valor: valor,
      idCategoria: idCategoria
    };

    console.log(JSON.stringify(obj))
    try {

      let resposta = false;
      if (novoRegistro)
        resposta = await DbService.adicionaProduto(obj);
      else
        resposta = await DbService.alteraProduto(obj);

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
      let contatos = await DbService.obtemTodosProdutos();
      let categorias = await DbCategoriaService.obtemTodasCategorias();
      setCategorias(categorias)
      setProdutos(contatos);
    } catch (e) {
      Alert.alert(e.toString());
    }
  }


  function editar(identificador) {
    const produto = produtos.find(produto => produto.codigo == identificador);

    if (produto != undefined) {
      setCodigo(produto.codigo);
      setDescricao(produto.descricao);
      setValor(produto.valor);
      setIdCategoria(produto.idCategoria)
      setNomeCategoria(produto.categoria)
    }

    console.log(produto)
  }


  async function limparCampos() {
    setDescricao("");
    setValor("");
    setCodigo(undefined);
    setIdCategoria("")
    setNomeCategoria("")
    Keyboard.dismiss();
  }


  async function efetivaExclusao() {
    try {
      await DbService.excluiTodosContatos();
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
      await DbService.excluiProduto(identificador);
      Keyboard.dismiss();
      limparCampos();
      await carregaDados();
      Alert.alert('Produto apagado com sucesso!!!');
    } catch (e) {
      Alert.alert(e);
    }
  }

  function findIdCategoria(desc) {
    let categoria = categorias.find((value, index) => value.codigo === desc.codigo)
    setIdCategoria(categoria.codigo)
  }

  function findDescCategoria(desc) {
    let categoria = categorias.find((value, index) => value.codigo === desc.codigo)
    return categoria.descricao;
  }

  return (
    <GluestackUIProvider config={config}>
      <Center mt={40}>
        <Text size='2xl' fontWeight="$bold">
          Quitanda
        </Text>
        <Text size='xl' fontWeight="$bold">
          Produtos
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

        <Box mt={5}> 
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

        <Box mt={5}>
          <Text>Valor</Text>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
          >
            <InputField value={valor != undefined ? String(valor) : valor} onChangeText={(texto) => setValor(texto)} />
          </Input>
        </Box>

        
        <Select selectedValue={nomeCategoria} onValueChange={select => findIdCategoria(select)}>
            <Text>Categorias</Text>
          <SelectTrigger  variant="outline" size="md" >
            <SelectInput placeholder="Selecione a categoria" />
            
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop/>
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
                {
                    categorias.map((value, index) => 
                        {
                            console.log(value)
                            return (<SelectItem label={value.descricao} value={value} />) 
                        }
                    )
                }
            </SelectContent>
          </SelectPortal>
        </Select>
      

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

        <ScrollView>
        {
          produtos.map((produto, index) => (
            <Box mt={5}>
              <HStack space='xs'>
                <HStack minWidth={280}>
                    <Center >
                        <Box minWidth={150}>
                            <Text>Nome: {produto.descricao} </Text>
                        </Box>
                    </Center>
                    <Center>
                        <Text>|  Preço {produto.valor}</Text>
                    </Center>
                </HStack>
                <Button
                  size="sm"
                  variant="solid"
                  action="primary"
                  isDisabled={false}
                  isFocusVisible={false}
                  onPress={() => removerElemento(produto.codigo)}
                >
                  <ButtonText size='xs'>-</ButtonText>
                </Button>
                <Button
                  size="sm"
                  variant="solid"
                  action="primary"
                  isDisabled={false}
                  isFocusVisible={false}
                  onPress={() => editar(produto.codigo)}
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