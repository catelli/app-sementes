/* eslint-disable linebreak-style */
/* eslint-disable react/sort-comp */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/no-array-index-key */
/* eslint-disable arrow-parens */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-curly-brace-presence */
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
  View,
  StyleSheet,
  Text,
  StatusBar,
  Modal,
  ActivityIndicator,
  ScrollView,
  Alert
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from "axios";
import SideMenu from "react-native-side-menu";
import BarraNavegacao from "./BarraNavegacao";
import Menu from "./Menu";
import { getUser, onSignOut } from "./Auth";
import { initDbPromise } from "./AuthDB";

export default class CenaAtualizaDados extends Component {
  constructor(props) {
    super(props);
    /* menu */
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      selectedObservacoes: "",
      alertVisibility: false,
      isLoading: false,

      /* menu */
      isOpen: false,
      selectedItem: "About",

      nameVisibility: "",
      buttonFazendasVisibility: false, 
      dataRegisterClientes: [],
      dataRegisterFazendas: [],
      dataRegisterCidades: [],
      usuarioLogado:{}
    };  

    this.importClientes = this.importClientes.bind(this);
  }

   //LOGIN-LOGOUT
   userInformations = async () => {
    const user = await getUser();
    this.setState({usuarioLogado: user});
  }

  async logout(){
    await onSignOut();
    this.props.navigation.navigate("MainSignin");
  }

  componentDidMount() {
    this.userInformations();
    loc(this);
  }

  componentWillMount() {
    rol();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

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

  /* menu */
  onMenuItemSelected = item =>
    this.setState({
      isOpen: false,
      selectedItem: item
  });

  showCustomAlert(visible) {
    this.setState({ alertVisibility: visible });
  }
  
  showLoading() {
    this.setState({ isLoading: true });
  }
  
  hideLoading() {
    this.setState({ isLoading: false });
  }

  setMessage(name){
    setTimeout(() => {
      this.hideLoading();
      this.setState({ nameVisibility: name, alertVisibility: true });
      setTimeout(() => {
        this.setState({ alertVisibility: false });
      }, 3000);
    }, 3000);
  }

  async importAll(){

      this.showLoading();
      const cidades = null;
      const fazendas = null;
      const regioes = null;
      const classificacoes = null;
      const precos = null;

      const clientes = await this.importClientes(true);
      if(clientes){
        this.fazendas = await this.importFazendas(true);
      } 
      if(this.fazendas){
        this.cidades = await this.importCidades(true);
      } 
      if(this.cidades){
        this.regioes = await this.importRegioes(true);
      } 
      if(this.regioes){
        this.classificacoes = await this.importClassificacoes(true);
      }
      if(this.classificacoes){
        this.precos =  await this.importPrecosCultivares(true);
      }
      if(this.precos){
        this.setMessage('Importações');
        this.props.navigation.push('cenaprincipal');
      }
        
  }

  async importClientes(isMessage){
    const db = await initDbPromise();
    if(!isMessage){
      this.showLoading();
      this.setState({ buttonFazendasVisibility : true});
    }
    try {
     //await db.transaction(async (tx) => {
        const results = await db.executeSql('SELECT * FROM clientes WHERE idbanco > 0 ORDER BY idbanco DESC LIMIT 1');
        const lastCustomer = results[0].rows.item(0);
        let idLastCustomer = ""
        if(lastCustomer === undefined) {
          console.log('passou aqui 1');
          this.idLastCustomer = null;
        }else{
          console.log('passou aqui 2');
          this.idLastCustomer = lastCustomer.idbanco;
        }
        let response = await axios.get(`https://carregamento.petrovina.com.br/api/server/clientes/${this.idLastCustomer}`);
        console.log(response.data);
        let countResults = response.data.clientes.length;
        let count = 0;
        if(countResults > 0){    
          await Promise.all(response.data.clientes.map(async (res) => {
            await db.executeSql(
              'INSERT INTO clientes (idbanco,nome,cnpj_cpf,codigoclifor) VALUES (?,?,?,?)',
              [res.id,res.nome,res.cnpj_cpf,res.codigoclifor]
            );
            count++;
            if(count === parseInt(response.data.total)){
              await db.close();
              if(!isMessage){
                this.setMessage("Clientes");
                this.props.navigation.push('cenaprincipal');
              } 
            }
          }));
        }else{
          if(!isMessage){
            this.hideLoading();
            Alert.alert('Importação não realizada',
             'Não existem dados atualizados para clientes',
             [
               {text: 'Ok'},
             ],
             { cancelable: false }
           );  
          }
        }
        console.log(countResults);
        if(isMessage){
          return true;
        }
      //});
    } catch (error) {
      await db.close();
      this.hideLoading();
      throw new Error(`Something failed`);
    }
  }


  async importFazendas(isMessage) {
    const db = await initDbPromise();
    if(!isMessage){
      this.showLoading();
      this.setState({ buttonFazendasVisibility : true });
    }
    try {
      //await db.transaction(async (tx) => {
        const results = await db.executeSql('SELECT * FROM fazendas WHERE idbanco > 0 ORDER BY idbanco DESC LIMIT 1');
        const lastFarm = results[0].rows.item(0);
        let idLastFarm = "";
        if(lastFarm === undefined) {
          console.log('passou aqui 1');
          this.idLastFarm = null;
        }else{
          console.log('passou aqui 2');
          this.idLastFarm = lastFarm.idbanco;
        }
        let response = await axios.get(`https://carregamento.petrovina.com.br/api/server/fazendas/${this.idLastFarm}`);
        console.log(response.data);
        let countResults = response.data.fazendas.length;
        let count = 0;
        if(countResults > 0){    
          await Promise.all(response.data.fazendas.map(async (res) => {
            await db.executeSql(
              'INSERT INTO fazendas (idbanco, nome, email, cep, endereco, complemento, telefone, inscricao, codigoclifor, codigolocal, codigomunicipio) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
              [
                res.id, res.nome, res.email,res.cep, 
                res.endereco, res.complemento, res.telefone,res.inscricao, res.codigoclifor, 
                res.codigolocal, res.codigomunicipio,
              ]
            );
            count++;
            if(count === parseInt(response.data.total)) {
              await db.close();
              if(!isMessage){
                this.setMessage("Fazendas");
                this.props.navigation.push('cenaprincipal');
              }
            }
          }));
        } else {
          if(!isMessage){
            this.hideLoading();
            Alert.alert('Importação não realizada',
             'Não existem dados atualizados para Fazendas',
             [
               {text: 'Ok'},
             ],
             { cancelable: false }
           );
          }
        }
        console.log(countResults); 
        if(isMessage){
          return true;
        }
      //});

    } catch (error) {
      await db.close();
      this.hideLoading();
      throw new Error(`Something failed`);
    }
  }

  async importCidades(isMessage) {
    const db = await initDbPromise();
    if(!isMessage){
      this.showLoading();
    }
    try {
      //await db.transaction(async (tx) => {
        const results = await db.executeSql('SELECT * FROM cidades ORDER BY id DESC LIMIT 1');
        const lastCity = results[0].rows.item(0);
        let idLastCity = "";
        if(lastCity === undefined) {
          console.log('passou aqui 1');
          this.idLastCity = null;
        }else{
          console.log('passou aqui 2');
          this.idLastCity = lastCity.id;
        }
        let response = await axios.get(`https://carregamento.petrovina.com.br/api/server/cidades/${this.idLastCity}`);
        console.log(response.data);
        let countResults = response.data.cidades.length;
        let count = 0;
        if(countResults > 0){    
          await Promise.all(response.data.cidades.map(async (res) => {
            console.log(res.id);
            await db.executeSql(
              'INSERT INTO cidades (id,nome,estado,cep,ibge,estado_id, regiao_id) VALUES (?,?,?,?,?,?,?)',
                  [
                    res.id, res.nome, res.estado, 
                    res.cep, res.ibge, res.estado_id, 
                    res.regiao_id
                  ]
            );
            count++;
            if(count === parseInt(response.data.total)){
              await db.close();
              if(!isMessage){
                this.setMessage("Cidades");
                this.props.navigation.push('cenaprincipal');
              }
              
            }
          }));
        }else{
          if(!isMessage){
            this.hideLoading();
            Alert.alert('Importação não realizada',
              'Não existem dados atualizados para Cidades',
              [
                {text: 'Ok'},
              ],
              { cancelable: false }
            );
          }
        }
        console.log(countResults); 
        if(isMessage){
          return true;
        }
      //});

    } catch (error) {
      await db.close();
      this.hideLoading();
      throw new Error(`Something failed`);
    }
  }

  async importRegioes(isMessage) {
    const db = await initDbPromise();
    if(!isMessage){
      this.showLoading();
    }
    try {
      //await db.transaction(async (tx) => {
        const results = await db.executeSql('SELECT * FROM regioes ORDER BY id DESC LIMIT 1');
        const lastRegion = results[0].rows.item(0);
        let idLastRegion = "";
        if(lastRegion === undefined) {
          console.log('passou aqui 1');
          this.lastRegion = null;
        }else{
          console.log('passou aqui 2');
          this.idLastRegion = lastRegion.id;
        }
        let response = await axios.get(`https://carregamento.petrovina.com.br/api/server/regioes/${this.idLastRegion}`);
        console.log(response.data);
        let countResults = response.data.regioes.length;
        let count = 0;
        if(countResults > 0){    
          await Promise.all(response.data.regioes.map(async (res) => {
            console.log(res.id);
            await db.executeSql(
              'INSERT INTO regioes (id,nome) VALUES (?,?)',
                  [
                    res.id, res.nome 
                  ]
            );
            count++;
            if(count === parseInt(response.data.total)){
              await db.close();
              if(!isMessage){
                this.setMessage("Regiões");
                this.props.navigation.push('cenaprincipal');
              }
            }
          }));
        }else{
          if(!isMessage){
            this.hideLoading();
            Alert.alert('Importação não realizada',
              'Não existem dados atualizados para Regiões',
              [
                {text: 'Ok'},
              ],
              { cancelable: false }
            );
          }
        }
        console.log(countResults); 
        if(isMessage){
          return true;
        }
      //});

    } catch (error) {
      await db.close();
      this.hideLoading();
      throw new Error(`Something failed`);
    }
  }


  async importClassificacoes(isMessage) {
    const db = await initDbPromise();
    if(!isMessage){
      this.showLoading();
    }
    try {
      //await db.transaction(async (tx) => {
        const results = await db.executeSql('SELECT * FROM classificacoes ORDER BY id DESC LIMIT 1');
        const lastClassification = results[0].rows.item(0);
        let idLastClassification = "";
        if(lastClassification === undefined) {
          console.log('passou aqui 1');
          this.lastClassification = null;
        }else{
          console.log('passou aqui 2');
          this.idLastClassification = lastClassification.id;
        }
        let response = await axios.get(`https://carregamento.petrovina.com.br/api/server/classificacoes/${this.idLastClassification}`);
        console.log(response.data);
        let countResults = response.data.classificacoes.length;
        let count = 0;
        if(countResults > 0){    
          await Promise.all(response.data.classificacoes.map(async (res) => {
            console.log(res.id);
            await db.executeSql(
              'INSERT INTO classificacoes (id,classificacao,valorInicial, valorFinal, modalidade) VALUES (?,?,?,?,?)',
                  [
                    res.id, res.classificacao,
                    res.valorInicial,res.valorFinal,
                    res.modalidade 
                  ]
            );
            count++;
            if(count === parseInt(response.data.total)){
              await db.close();
              if(!isMessage){
                this.setMessage("Classificacoes");
                this.props.navigation.push('cenaprincipal');
              }
            }
          }));
        }else{
          if(!isMessage){
            this.hideLoading();
            Alert.alert('Importação não realizada',
             'Não existem dados atualizados para Classificações',
             [
               {text: 'Ok'},
             ],
             { cancelable: false }
            );
          }
        }
        console.log(countResults); 
        if(isMessage){
          return true;
        }
      //});

    } catch (error) {
      await db.close();
      this.hideLoading();
      throw new Error(`Something failed`);
    }
  }

  async importPrecosCultivares(isMessage) {
    const db = await initDbPromise();
    if(!isMessage){
      this.showLoading();
      this.setState({buttonFazendasVisibility : true});
    }
    try {
      //await db.transaction(async (tx) => {
        await db.executeSql('DELETE FROM precos');
        let response = await axios.get('https://carregamento.petrovina.com.br/api/server/precos');
        console.log(response.data);
        let countResults = response.data.precos.length;
        let count = 0;
        if(countResults > 0){    
          await Promise.all(response.data.precos.map(async (res) => {
            console.log(res.id);
            await db.executeSql(
              'INSERT INTO precos (id,regiao,cultivar,prime_tec_germoplasma, prime_pro_germoplasma,populacao_ha, royalties, prime_tech, prime_pro, peso_medio_bag, standak_top, fortenza, fortenza_duo, fortenza_elite, inoculante, frete, indigo_a_vista, indigo_challenge) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
              [res.id,res.regiao,res.cultivar,res.prime_tec_germoplasma, 
                res.prime_pro_germoplasma, res.populacao_ha, res.royalties, 
                res.prime_tech, res.prime_pro, res.peso_medio_bag, res.standak_top, 
                res.fortenza, res.fortenza_duo, res.fortenza_elite, res.inoculante, 
                res.frete, res.indigo_a_vista, res.indigo_challenge]
            );
            count++;

            if(count === parseInt(response.data.total)) {
              await db.close();
              if(!isMessage){
                this.setMessage("Cultivares/Preços");
                this.props.navigation.push('cenaprincipal');
              }
            }
          }));
        }else{
          if(!isMessage){ 
            this.hideLoading();
            Alert.alert('Importação não realizada',
              'Não existem dados atualizados para Cultivares/Preços',
              [
                {text: 'Ok'},
              ],
              { cancelable: false }
            );
          }
        }
        console.log(countResults); 
        if(isMessage){
          return true;
        }
      //});
    } catch (error) {
      await db.close();
      this.hideLoading();
      throw new Error(`Something failed`);
    }
  }

  render() {
    const { navigation } = this.props;
    const menu = <Menu navigation={navigation} logado={this.state.usuarioLogado} logout={this.logout} />;

    return (
      <SideMenu
        menu={menu}
        isOpen={this.state.isOpen}
        onChange={isOpen => this.updateMenuState(isOpen)}
        menuPosition={"right"}
        edgeHitWidth={0}
      >
        <View style={styles.container}>
          <StatusBar backgroundColor="#33723D" />
          <BarraNavegacao
            voltar
            navigation={navigation}
            toggle={this.toggle}
          />
          {this.state.isLoading && (
            <View style={styles.loading}>
              <ActivityIndicator
                color="#409551"
                size="large"
              />
            </View>
          )}
          <ScrollView style={styles.conteudo}>
            <View style={styles.viewTxt}>
              <Text style={styles.txt}>
                Sincronização poderá ser feita uma por vez ou de uma só vez. Os dados importados
                serão atualizados conforme o WebService Petrovina.
              </Text>
            </View>
            <View style={styles.viewButton}>
              <TouchableOpacity
                onPress={() => {
                  this.importAll();
                }}
              >
                <View style={[styles.botao, {backgroundColor: "#FFA500"}]}>
                  <Text style={[styles.txtBotao, {color:"#FFF"}]}> Importar Todos </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.viewButton}>
              <TouchableOpacity
                onPress={() => {
                  this.importClientes();
                }}
              >
                <View style={styles.botao}>
                  <Text style={styles.txtBotao}> Clientes </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.viewButton}>
              <TouchableOpacity
                onPress={() => {
                  if(this.state.buttonFazendasVisibility){
                    this.importFazendas();
                  }else{
                    Alert.alert('Importação interrompida',
                     'É necessario primeiramente importar clientes.',
                      [
                        {text: 'Ok'},
                      ],
                      { cancelable: false }
                    );
                  }
                }}
              >
                <View style={styles.botao}>
                  <Text style={styles.txtBotao}> Fazendas </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.viewButton}>
              <TouchableOpacity
                onPress={() => {
                  this.importPrecosCultivares();
                }}
              >
                <View style={styles.botao}>
                  <Text style={styles.txtBotao}> Cultivares/Preços </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.viewButton}>
              <TouchableOpacity
                onPress={() => {
                  this.importClassificacoes();
                }}
              >
                <View style={styles.botao}>
                  <Text style={styles.txtBotao}> Classificações </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.viewButton}>
              <TouchableOpacity
                onPress={() => {
                  this.importCidades();
                }}
              >
                <View style={styles.botao}>
                  <Text style={styles.txtBotao}> Cidades </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.viewButton}>
              <TouchableOpacity
                onPress={() => {
                  this.importRegioes();
                }}
              >
                <View style={styles.botao}>
                  <Text style={styles.txtBotao}> Regiões </Text>
                </View>
              </TouchableOpacity>
            </View>
           
           
          </ScrollView>

          {/* MODAL MENSAGEM */}
          <Modal
            visible={this.state.alertVisibility}
            transparent={true}
            animationType={"fade"}
            onRequestClose={() => {
              this.showCustomAlert(!this.state.alertVisibility);
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)"
              }}
            >
              <View style={styles.alertMainView}>
                <Text style={styles.alertTitle}>
                  Importação Realizada!
                </Text>
                <Text style={styles.alertMessage}>
                  {" "}
                  Atualização de {this.state.nameVisibility} realizada(o) com sucesso.
                  {" "}
                </Text>
              </View>
            </View>
          </Modal>
        </View>
      </SideMenu>
    );
  }
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#FFF", flex: 1 },
  conteudo: { flex: 1, padding: "2.5%", flexDirection: "column" },
  viewTxt: { flex: 1, justifyContent: "flex-end" },
  txt: {
    fontSize: wp("5%"),
    color: "#925E33",
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: "3%",
    zIndex: 0
  },
  viewButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  botao: {
    width: wp("55%"),
    height: hp("13%"),
    backgroundColor: "#018A3C",
    borderColor: "#FFF",
    borderWidth: 1,
    marginVertical: "5%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0,
  },
  txtBotao: {
    fontSize: wp("4.5%"),
    color: "#D2D926",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    marginBottom: "5%"
  },
  /* MODAL MENSAGEM */
  alertMainView: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#409551",
    height: hp("30%"),
    width: wp("90%"),
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "#409551",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  },
  alertTitle: {
    fontSize: wp("8%"),
    fontFamily: "Roboto-Regular",
    color: "#fff",
    textAlign: "center",
    padding: "1%",
    height: "48%",
    marginTop: "10%"
  },
  alertMessage: {
    fontSize: wp("5%"),
    color: "#fff",
    fontFamily: "Roboto-Regular",
    textAlign: "center",
    padding: 3,
    height: "48%"
  },
  buttonStyle: {
    width: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },

  /* ACTIVITY INDICATOR */
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1

  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: hp(80)
  }
});
