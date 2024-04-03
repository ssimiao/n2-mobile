import { StatusBar } from 'expo-status-bar';

import {
  Alert, TextInput, TouchableOpacity,
  View, Keyboard, ScrollView, Image, StyleSheet
} from 'react-native';
import { useState, useEffect } from 'react';
import { GluestackUIProvider, Button, ButtonText, Text, Box, Input, Center, InputField, VStack, HStack } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import * as DbService from './DbProdutos';
import * as DbVendaService from './DbVendas';
import * as DbCategoriaService from './DbCategoria';


export default function Vendas() {

  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [carrinho, setCarrinho] = useState([]);

  async function processamentoUseEffect() {
    try {      
      await DbService.createTable();      
      await DbCategoriaService.createTable();      
      await DbVendaService.createTable();      
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
    return Date.now().toString(36) + Math.random().toString(36).slice(0, 6);
  }

  async function carregaDados() {
    try {
      console.log('carregando');
      let contatos = await DbService.obtemTodosProdutos();
      let vendas = await DbVendaService.obtemTodasVendas()
      setVendas(vendas)
      setProdutos(contatos);
    } catch (e) {
      Alert.alert(e.toString());
    }
  }

  console.log(vendas)

  function adicionarProdutoAoCarrinho(identificador) {
    const produto = produtos.find(produto => produto.codigo == identificador);

    console.log(produto);
    let produtoCarrinho = carrinho.find(produto => {
        console.log(produto)
        return produto.codigo == identificador
    });
    
    console.log("Ja tem produto no carrinho: " + produtoCarrinho == undefined)
    if (produtoCarrinho == undefined)
        setCarrinho([...carrinho, {'codigo': produto.codigo, 'descricao': produto.descricao, 'valor': produto.valor, 'quantidade': 1}])
    else {
        let novoArray = carrinho.map((value, index) => {
            console.log("produto carrinho" + JSON.stringify(produtoCarrinho))
            console.log("produto lista" + JSON.stringify(value))
            console.log(value.codigo == produtoCarrinho.codigo)
            if(value.codigo == produtoCarrinho.codigo){
                value.quantidade = value.quantidade + 1
            }

            return value
        })
        setCarrinho(novoArray)
    }
  }

  function diminuirQuantidade(identificador) {
    const produto = produtos.find(produto => produto.codigo == identificador);
    console.log(produto);

    let produtoCarrinho = carrinho.find(produto => {
        return produto.codigo == identificador
    });
    
    console.log("Não tem produto no carrinho: " + produtoCarrinho == undefined)
    if (produtoCarrinho != undefined){
        let novoArray = carrinho.map((value, index) => {
            if(value.codigo == produtoCarrinho.codigo){
                value.quantidade = value.quantidade - 1
            }

            return value
        })

        setCarrinho(novoArray.filter(a => a.quantidade >= 0))
    }
  }

    async function comprar() {
        let idVenda = createUniqueId()
        let dataVenda = new Date()
        DbVendaService.adicionaVenda(carrinho, idVenda, dataVenda.toISOString())
        .then(response => {
            Alert.alert('Cadastrou a venda!');
            setCarrinho([])
        }).catch((reason) => {
            console.log("erro: " + reason)
        })
    }

  return (
    <GluestackUIProvider config={config}>
      <Center mt={40}>
        <Text size='2xl' fontWeight="$bold">
          Quitanda
        </Text>
        <Text size='md' fontWeight="$bold">
          Vendas
        </Text>
      </Center>

      <Box mx={20}>

        <Text mt={20} bold>Produtos Disponiveis: </Text>
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
                  onPress={() => diminuirQuantidade(produto.codigo)}
                >
                  <ButtonText size='xs'>-</ButtonText>
                </Button>
                <Button
                  size="sm"
                  variant="solid"
                  action="primary"
                  isDisabled={false}
                  isFocusVisible={false}
                  onPress={() => adicionarProdutoAoCarrinho(produto.codigo)}
                >
                  <ButtonText size='xs'>+</ButtonText>
                </Button>
              </HStack>
            </Box>
          ))
        }
      </ScrollView>

      <Text mt={20} bold>Carrinho de compras: </Text>
        <ScrollView>
        {
          carrinho.map((produto, index) => (
            <Box mt={5}>
              <HStack space='md'>
                <Center>
                  <Text>Descrição: {produto.descricao}</Text>
                </Center>
                <Center>
                  <Text>|  Preço: {produto.valor}</Text>
                </Center>
            
              </HStack>
              <HStack>
                <Center>
                  <Text>Quantidade: {produto.quantidade}</Text>
                </Center>
              </HStack>
            </Box>
          ))
        }

      </ScrollView>
      <Button mt={20}
            size="sm"
            variant="solid"
            action="primary"
            isDisabled={false}
            isFocusVisible={false}
            onPress={() => comprar()}
            >
            <ButtonText size='xs'>Comprar</ButtonText>
        </Button>
      </Box>
    </GluestackUIProvider>
  );
}