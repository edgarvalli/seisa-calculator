import React from 'react';
import { StyleSheet, KeyboardAvoidingView, View, Image, ScrollView, Alert } from 'react-native';
import { FormInput, FormLabel, CheckBox, Button } from 'react-native-elements';

export default class Home extends React.Component {
  
  state = {
    power: 0,
    kwPrice: 0,
    steamPrice:0,
    optionSelected: {
      hotWater: false,
      coolWater: false,
      hotWaterAndSteam: false,
      coolWaterAndSteam: false
    }
  }

  handleChecbox(option) {
    const { optionSelected } = this.state;
    for(os in optionSelected) {
      optionSelected[os] = false;
    }
    optionSelected[option] = true;
    this.setState({optionSelected})
  }
  
  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <ScrollView contentContainerStyle={{padding: 5}}>
        
          <Image
            resizeMethod="auto"
            resizeMode="contain"
            style={{width: "80%", marginLeft: "5%"}}
            source={require("../assets/images/logo_seisa.png")}
          />

          <View style={{width: "100%"}}>
            <FormLabel>Potencia Promedio</FormLabel>
            <FormInput
              placeholder="Agrega tu potencia promedio"
              onChangeText={ power => this.setState({power}) }
              containerStyle={styles.input}
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => this.refs.kw_input.focus()}
            />
          </View>

          <View style={{width: "100%"}}>
            <FormLabel>Precio medio KW/h</FormLabel>
            <FormInput
              ref="kw_input"
              placeholder="Agrega tu precio promedio de tu KW/h"
              onChangeText={ kwPrice => this.setState({kwPrice}) }
              containerStyle={styles.input}
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => this.refs.sp_input.focus()}
            />
          </View>

          <View style={{width: "100%"}}>
            <FormLabel>Precio Gas MMBTU</FormLabel>
            <FormInput
              ref="sp_input"
              placeholder="Agrega tu precio de GAS"
              onChangeText={ steamPrice => this.setState({steamPrice}) }
              containerStyle={styles.input}
              keyboardType="numeric"
              returnKeyType="next"
            />
          </View>

          <View style={{width: "100%", marginTop:10}}>
            <CheckBox
              containerStyle={{width: "100%", backgroundColor: "#ffff", borderColor: "#fff"}}
              title="Agua Caliente"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={this.state.optionSelected.hotWater}
              onPress={check => this.handleChecbox("hotWater")}
            />
            <CheckBox
              containerStyle={{width: "100%", backgroundColor: "#ffff", borderColor: "#fff"}}
              title="Agua Fria"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={this.state.optionSelected.coolWater}
              onPress={check => this.handleChecbox("coolWater")}
            />
            <CheckBox
              containerStyle={{width: "100%", backgroundColor: "#ffff", borderColor: "#fff"}}
              title="Vapor y Agua Caliente"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={this.state.optionSelected.hotWaterAndSteam}
              onPress={check => this.handleChecbox("hotWaterAndSteam")}
            />
            <CheckBox
              containerStyle={{width: "100%", backgroundColor: "#ffff", borderColor: "#fff"}}
              title="Vapor y Agua Fria"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={this.state.optionSelected.coolWaterAndSteam}
              onPress={check => this.handleChecbox("coolWaterAndSteam")}
            />
          </View>

          <Button
            style={{width: "100%", marginTop: 10, marginBottom: 10}}
            title="Calcular"
            onPress={ev => {
              const { navigate } = this.props.navigation;
              let oneSelected = false;
              const { power, steamPrice, kwPrice, optionSelected } = this.state;
              for( os in optionSelected) {
                if(optionSelected[os]){
                  oneSelected = true;
                }
              }
              
              if(power <= 0 || steamPrice <= 0 || kwPrice <= 0) {
                Alert.alert("No debes de dejar ningun input vacio");
                return false;
              } else if(!oneSelected){
                Alert.alert("Debes seleccionar al menos una opcion");
                return false;
              } else {
                navigate('Result', {power, steamPrice, kwPrice, optionSelected})
              }
            }}
          />

        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  input: {
    width: "100%",
    padding: 1
  }
});