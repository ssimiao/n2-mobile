import { StatusBar } from 'expo-status-bar';

import {
  Alert, TextInput, TouchableOpacity,
  View, Keyboard, ScrollView, Image, StyleSheet
} from 'react-native';
import { useState, useEffect } from 'react';
import { GluestackUIProvider, Button, ButtonText, Text, Box, Input, Center, InputField, VStack, HStack, Progress } from "@gluestack-ui/themed";
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


  function createUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(0, 2);
  }


  async function salvaDados() {
    let novoRegistro = (codigo == undefined);

    let obj = {
      codigo: novoRegistro ? createUniqueId() : codigo,
      descricao: descricao,
      valor: valor,
    };

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
      let vendas = await DbVendaService.obtemTodasVendas()
      setVendas(Object.values(vendas.reduce(function(results, venda) {
        (results[venda.codigo] = results[venda.codigo] || []).push(venda);
        return results;
    }, {})))
      
      
    } catch (e) {
      Alert.alert(e.toString());
    }
  }


  function adicionarProdutoAoCarrinho(identificador) {
    const produto = produtos.find(produto => produto.codigo == identificador);

    if (produto != undefined) {
      setCodigo(produto.codigo);
      setDescricao(produto.descricao);
      setValor(produto.valor);
    }

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


  async function limparCampos() {
    setDescricao("");
    setValor("");
    setCodigo(undefined);
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

        <ScrollView>
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
                                    totalSum = totalSum + produto.valorProduto
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
                                                    <Box minWidth={150}>
                                                        <Text><Text bold>Nome:</Text> {produto.nomeProduto}</Text>
                                                    </Box>
                                                </Center>

                                                <Center >
                                                    <Box minWidth={140}>
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