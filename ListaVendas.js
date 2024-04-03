import { StatusBar } from 'expo-status-bar';

import {
  Alert, TextInput, TouchableOpacity,
  View, Keyboard, Image, StyleSheet
} from 'react-native';
import { useState, useEffect } from 'react';
import { GluestackUIProvider, Button, ButtonText, ScrollView, Text, Box, Input, Center, InputField, VStack, HStack, Progress } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import * as DbService from './DbProdutos';
import * as DbVendaService from './DbVendas';
import { ProgressFilledTrack } from '@gluestack-ui/themed';

export default function ListaVendas() {

  const [codigo, setCodigo] = useState();
  const [descricao, setDescricao] = useState();
  const [valor, setValor] = useState();
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [vendas, setVendas] = useState([]);


  async function processamentoUseEffect() {
    try {      
      await DbService.createTable();   
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



  async function carregaDados() {
    try {
      console.log('carregando');
      let vendas = await DbVendaService.obtemTodasVendas()
      setVendas(Object.values(vendas.reduce(function(results, venda) {
        (results[venda.codigo] = results[venda.codigo] || []).push(venda);
        return results;
    }, {})))
      
      
    } catch (e) {
      Alert.alert(e.toString());
    }
  }


  return (
    <GluestackUIProvider config={config}>
      <Center mt={40}>
        <Text size='2xl' fontWeight="$bold">
          Quitanda
        </Text>
        <Text size='md' fontWeight="$bold">
          Lista de Vendas
        </Text>
      </Center>

      <Box mx={10} mt={10}>

        <ScrollView mt={5} h='80%'>
        {
            vendas.map((venda, index) => {
                console.log(venda[0].codigo)
                let totalSum = 0;
                return (<Box mt={5}>
                            <Box minWidth={150}>
                                <Text><Text bold>Venda:</Text> {venda[0].codigo}</Text>
                                <Text><Text bold>Data Venda:</Text> {venda[0].data}</Text>
                            </Box>
                            {
                                venda.map((produto, index) => {
                                    console.log(produto)
                                    totalSum = totalSum + produto.valorProduto * produto.quantidade
                                    return (<Box>
                                        <HStack space='xs'>
                                            <HStack minWidth={280}>
                                                {
                                                    /* 
                                                        <Center >
                                                            <Box minWidth={150}>
                                                                <Text>Codigo Produto: {produto.codigoProduto}</Text>
                                                            </Box>
                                                        </Center>
                                                    */
                                                }
                                            
                                                <Center >
                                                    <Box minWidth={140}>
                                                        <Text><Text bold>Nome:</Text> {produto.nomeProduto}</Text>
                                                    </Box>
                                                </Center>

                                                <Center >
                                                    <Box minWidth={125}>
                                                        <Text><Text bold>Quantidade:</Text> {produto.quantidade}</Text>
                                                    </Box>
                                                </Center>
                                                <Center >
                                                    <Box minWidth={100}>
                                                        <Text><Text bold>Valor:</Text> {produto.valorProduto}</Text>
                                                    </Box>
                                                </Center>
                                            </HStack>
                                        </HStack>
                                    </Box>)
                                })
                            }
                            <Text>
                                <Text bold>Valor Total: {totalSum}</Text> 
                            </Text>
                        <Progress value={100}  h="$1">
                            <ProgressFilledTrack h="$1" />
                        </Progress>
                      </Box>)
            })
        } 
      </ScrollView>

      
      </Box>
    </GluestackUIProvider>
  );
}