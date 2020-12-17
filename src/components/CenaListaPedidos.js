/* eslint-disable linebreak-style */
/* eslint-disable lines-between-class-members */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-console */
/* eslint-disable arrow-parens */
/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-else-return */
/* eslint-disable no-use-before-define */
/* eslint-disable default-case */
/* eslint-disable object-shorthand */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-undef */
/* eslint-disable global-require */
/* eslint-disable spaced-comment */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable arrow-body-style */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  StatusBar,
  Alert
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackActions, NavigationActions  } from 'react-navigation';
import SideMenu from "react-native-side-menu";
//import SQLite from 'react-native-sqlite-storage';
import CenaListaItensPedido from "./CenaListaItensPedido";
import BarraNavegacao from "./BarraNavegacao";
import Menu from "./Menu";
import { getUser, onSignOut } from "./Auth";

import { initDB, closeDatabase, initDbPromise } from "./AuthDB";

export default class CenaListaPedidos extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    /* menu */
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.delete = this.delete.bind(this);
    this.state = {
      listaItens: [],
      classificacao:{},

      /*login*/
      usuarioLogado:{},
      /* menu */
      isOpen: false,
      selectedItem: "About"
    };
  }

  //LOGIN-LOGOUT
  userInformations = async () => {
    const user = await getUser();
    this.setState({usuarioLogado: user});
  }

  async logout() {
    await onSignOut();
    this.props.navigation.navigate("MainSignin");
  }

  formatNumber(amount, decimalCount = 2, decimal = ",", thousands = ".") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
    }
  };

  somaTotal(array){
    return array.reduce((a,b) => a + b, 0);
  }

  /* CLASSIFICACAO */
  valorGermoPlasma(modalidade){
    const germoplasma = "";
    switch(modalidade){
      case 'PRIMETECH': 
        this.germoplasma = "prime_tec_germoplasma"; 
      break;
      case 'PRIMEPRO': 
        this.germoplasma = "prime_pro_germoplasma"; 
      break;
      case 'PRIMETOTALSEED': 
        this.germoplasma = "prime_pro_germoplasma"; 
      break;
      case 'PADRAO': 
        this.germoplasma = "prime_tec_germoplasma"; 
      break;
    }
    return this.germoplasma;
  }

  calculaValorSaca(item, totalpassado) {
    const valorSaca = 0;
    const quantidadebags = item.bags;
    const pesomedio = item.peso_medio_bag;
    const response = this.valorGermoPlasma(item.modalidade); 
    const royalties = item.royalties;
    //se o frete for fob ele é zero , se nao é com o valor que estiver na tabela de preço!
    const frete = 0;
    if(item.tipo_entrega == 'CIF') {
       this.frete = item.frete;
    } else {
      this.frete = 0;
    }

    totalpassadodividido = totalpassado/quantidadebags;
    const royaltiesFrete = (parseFloat(royalties) + parseFloat(this.frete));
    const germoplasmaValorEscolhido = totalpassadodividido - royaltiesFrete; 
    const sacas = parseInt((quantidadebags * pesomedio)/40);
    const valorgermoplasma = parseFloat(germoplasmaValorEscolhido) * parseFloat(quantidadebags);
    this.valorSaca = valorgermoplasma/sacas;

    return this.valorSaca;
  }

  calculaClassificacao(lista) {
    const arrayTotalSacas = [];
    const arrayModalidade = [];
    const modalidade = "";
    lista.map(item => {
      const totalParaCalculo = 0;
      console.log(item.total_percentual);
      if(item.total_percentual){
        this.totalParaCalculo = item.total_percentual;
      }else{
        this.totalParaCalculo = item.total
      }
      const valorSaca = this.calculaValorSaca(item, this.totalParaCalculo);
      arrayTotalSacas.push(valorSaca);
      arrayModalidade.push(item.modalidade);
    })

    const total = this.somaTotal(arrayTotalSacas);
    const quantidade = arrayTotalSacas.length;

    if(arrayModalidade.includes('PRIMEPRO') || arrayModalidade.includes('TOTALSEED')){
      this.modalidade = "PRIMEPRO";
    }else{
      this.modalidade = "PRIMETECH";
    }

    const vf = total/quantidade; 
       
    return { valorfinal: vf, modalidade: this.modalidade};
  }

  fill() {
    return new Promise(
    (resolve) => {
      const { navigation } = this.props;
      const insertId = navigation.getParam('insertId');
      //const insertId = 43;
      console.log('ESSE É O INSERT ID ->>>>>>> '+ insertId);
      const tempItensPedido = [];
      initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT itens_pedido.id as id_item_pedido, itens_pedido.id_preco, itens_pedido.cultivar, itens_pedido.area, itens_pedido.modalidade, itens_pedido.espacamento, itens_pedido.plantas_metro, itens_pedido.bags, itens_pedido.id_pedido, itens_pedido.total, itens_pedido.total_percentual, itens_pedido.tipo_percentual, precos.*, pedidos.tipo_entrega '+
            'FROM itens_pedido '+
            'LEFT JOIN precos on precos.id = itens_pedido.id_preco '+
            'LEFT JOIN pedidos on pedidos.id = itens_pedido.id_pedido '+
            'WHERE itens_pedido.id_pedido = ?',
            [insertId], 
            (tx, results) => {
            for (let i = 0; i < results.rows.length; ++i) {
              tempItensPedido.push(results.rows.item(i));
            }
            if(this._isMounted){
              this.setState({ listaItens: tempItensPedido });
            }
            let calculo = this.calculaClassificacao(tempItensPedido);
            console.log(calculo);
            tx.executeSql(`SELECT * FROM classificacoes WHERE ${calculo.valorfinal} >= valorInicial AND ${calculo.valorfinal} <= valorFinal AND modalidade = "${calculo.modalidade}"`, [], (tx, results) => {
              if(this._isMounted) {
                console.log(results);
                this.setState({ classificacao: results.rows.item(0)});
              }
            });
          });
        }).then((result) => {
          closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
     });
  }

  componentDidMount() {
    this._isMounted = true;
    this.userInformations();
    loc(this);
  }

  componentWillMount() {
    this.fill();
    rol();
  }

  /* menu */
  onMenuItemSelected = item =>
    this.setState({
      isOpen: false,
      selectedItem: item
    });

  /* menu */
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  /* menu */
  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  async remove(idItensPedido){
    const db = await initDbPromise();
    try {
        const results = await db.executeSql('DELETE FROM itens_pedido WHERE id=?',[idItensPedido]);
        console.log(results); 
        if (results[0].rowsAffected > 0) {
          return true;
        } else {
          console.log('nao esta passando o valor');
        }
        await db.close();
    } catch (error) {
      await db.close();
      throw new Error(`Something failed`);
    }
  }
  
  delete(idItensPedido) {
    Alert.alert(
      'Deseja remover item do pedido?',
      'Ao remover o item, ele não fará mais parte do pedido.',
      [
        {
          text: 'Ok',
          onPress: async () => {
            const response = await this.remove(idItensPedido);
            if(response){
              this.props.navigation.replace('listaPedidos', { 
                regiao: this.props.navigation.getParam('regiao'),
                insertId : this.props.navigation.getParam('insertId'),
                tipoEntrega: this.props.navigation.getParam('tipoEntrega')
              });
            }   
            /*const resetAction = StackActions.reset({
              index: 0
            });
            this.props.navigation.dispatch(resetAction);*/
          },
        },
      ],
      { cancelable: false }
    );
  } 


  async updateClassificacao(){
    const db = await initDbPromise();
    try {
      const results = await db.executeSql(
      'UPDATE pedidos SET classificacao=? WHERE id=?',
      [ 
        this.state.classificacao.classificacao, 
        this.props.navigation.getParam('insertId'), 
      ]);
      if(results[0].rowsAffected > 0) {
        console.log('atualizado');
      }else{
        console.log('nao foi atualizado');
      }
      await db.close();
    } catch (error) {
      await db.close();
      throw new Error(`Something failed`);
    }
  }

  render() {
    const { navigation } = this.props;
    const menu = <Menu navigation={navigation} logado={this.state.usuarioLogado} logout={this.logout} />;
    const arrayTotal = [];
    
    return (
      <SideMenu
        menu={menu}
        isOpen={this.state.isOpen}
        onChange={isOpen => this.updateMenuState(isOpen)}
        menuPosition="right"
        edgeHitWidth={0}
      >
        <View style={styles.container}>
          <StatusBar backgroundColor="#33723D" />
          <BarraNavegacao
            voltar
            navigation={navigation}
            toggle={this.toggle}
          />
          <ScrollView>
            <Text style={styles.txtPedido}>PEDIDO N° {this.props.navigation.getParam('insertId')} </Text>
            {
            this.state.listaItens.map(item => {
              const totalFinal = item.total_percentual?item.total_percentual:item.total;
              arrayTotal.push(totalFinal);
              return (
                <CenaListaItensPedido key={item.id_item_pedido} itemPedido={item} delete={this.delete}/>   
              );
            })}
            <Text style={styles.txtTotal}>TOTAL R$ {this.formatNumber(this.somaTotal(arrayTotal))} </Text>
            <Text style={styles.txtClassificacao}>CLASSIFICAÇÃO {this.state.classificacao.classificacao} </Text>
            <View style={styles.viewButton}>
              <TouchableOpacity
                onPress={() => {
                  navigation.push('pedido2', {
                    regiao: this.props.navigation.getParam('regiao'), 
                    tipoEntrega: this.props.navigation.getParam('tipoEntrega'),
                    insertId : this.props.navigation.getParam('insertId')})
                }}
                style={styles.botaoAdd}
              >
                <Text style={styles.txtBotaoAdd}> Adicionar + </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.viewButton}>
              <TouchableOpacity
                onPress={async () => {
                  await this.updateClassificacao();
                  navigation.navigate("pedido4", {
                    insertId:this.props.navigation.getParam('insertId'),
                    total: this.somaTotal(arrayTotal),
                    itens: arrayTotal.length,
                    tipoEntrega: this.props.navigation.getParam('tipoEntrega')
                  });
                }}
                style={styles.botao}
              >
                <Text style={styles.txtBotao}> AVANÇAR </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SideMenu>
    );
  }
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#FFF", flex: 1 },
  txtPedido: {
    fontSize: wp("4%"),
    color: "#925E33",
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
    marginLeft: "7.5%",
    marginTop: "2%"
  },
  txtTotal: {
    fontSize: wp("6%"),
    color: "#716ACA",
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1,
    padding: "3.5%"
  },
  txtClassificacao:{
    fontSize: wp("4%"),
    color: "#716ACA",
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1,
    padding: "1%"
  },
  viewButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  botao: {
    width: wp("50%"),
    height: hp("10%"),
    backgroundColor: "#018A3C",
    borderColor: "#FFF",
    borderWidth: 1,
    marginVertical: "4.5%",
    justifyContent:"center"
  },
  txtBotao: {
    fontSize: wp("3.5%"),
    color: "#D2D926",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    marginBottom: "5%"
   },
   botaoAdd: {
    width: wp("25%"),
    height: hp("8%"),
    backgroundColor: "#FFA500",
    borderColor: "#FFF",
    borderWidth: 1,
    marginVertical: "5%",
    justifyContent:"center",
  },
   txtBotaoAdd: {
    fontSize: wp("3.5%"),
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontWeight: "500",
    marginBottom: "5%",
  },
});
