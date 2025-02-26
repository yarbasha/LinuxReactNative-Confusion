import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Text, Image } from 'react-native';
import { Icon, Input, CheckBox, Button } from 'react-native-elements'
import * as SecureStore from 'expo-secure-store';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { createBottomTabNavigator } from 'react-navigation';
import { baseUrl } from '../shared/baseUrl';
import * as ImageManipulator from "expo-image-manipulator";
import { Asset } from "expo-asset";


class LoginTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      remember: false
    };
  }

  componentDidMount() {
    SecureStore.getItemAsync('userInfo')
      .then(userData => {
        let userInfo = JSON.parse(userData);
        if (userInfo) {
          this.setState({
            username: userInfo.username,
            password: userInfo.password,
            remember: true
          })
        }
      })
  }

  static navigationOptions = {
    title: 'Login',
    tabBarIcon: ({ tintColor }) => (
      <Icon name='sign-in' type='font-awesome' size={24} iconStyle={{ color: tintColor }} />
    )
  };

  handleLogin() {
    console.log(JSON.stringify(this.state));
    if (this.state.remember) {
      SecureStore.setItemAsync('userInfo',
        JSON.stringify({
          username: this.state.username,
          password: this.state.password
        }))
        .catch(error => console.log('Could not save user info', error));
    }
    else {
      SecureStore.deleteItemAsync('userInfo')
        .catch(error => console.log('Could not delete user info', error));
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Input placeholder=" Username"
          leftIcon={{ type: 'font-awesome', name: 'user-o' }}
          onChangeText={username => this.setState({ username })}
          value={this.state.username}
          containerStyle={styles.formInput} />
        <Input placeholder=" Password"
          leftIcon={{ type: 'font-awesome', name: 'key' }}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
          containerStyle={styles.formInput} />
        <CheckBox title="Remember Me"
          center
          checked={this.state.remember}
          onPress={() => this.setState({ remember: !this.state.remember })}
          containerStyle={styles.formCheckbox} />
        <View style={styles.formButton}>
          <Button onPress={() => this.handleLogin()}
            title=" Login"
            icon={<Icon name='sign-in' type='font-awesome' size={24} color='white' />}
            buttonStyle={{ backgroundColor: "#512DA8" }} />
        </View>
        <View style={styles.formButton}>
          <Button onPress={() => this.props.navigation.navigate('Register')}
            title=" Register"
            clear
            icon={<Icon name='user-plus' type='font-awesome' size={24} color='blue' />}
            titleStyle={{ color: 'blue' }}
            buttonStyle={{ backgroundColor: null }} />
        </View>
      </View>
    );
  }
}

class RegisterTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      imageUrl: baseUrl + 'images/logo.png',
      remember: false
    };
  }

  getImageFromCamera = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
      let capturedImage = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });
      if (!capturedImage.cancelled) {
        this.processImage(capturedImage.uri);
      }
    }
  };

  getImageFromGallery = async () => {
    let pickedImage = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!pickedImage.cancelled) {
      this.processImage(pickedImage.uri);
    }
  };

  processImage = async (imageUri) => {
    let processedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        { resize: { width: 400 } }
      ],
      { format: 'png' }
    );
    this.setState({ imageUrl: processedImage.uri });
  }

  static navigationOptions = {
    title: 'Register',
    tabBarIcon: ({ tintColor }) => (
      <Icon name='user-plus' type='font-awesome' size={24} iconStyle={{ color: tintColor }} />
    )
  };

  handleRegister() {
    console.log(JSON.stringify(this.state));
    if (this.state.remember) {
      SecureStore.setItemAsync('userInfo',
        JSON.stringify({
          username: this.state.username,
          password: this.state.password
        }))
        .catch(error => console.log('Could not save user info', error));
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: this.state.imageUrl }}
              loadingIndicatorSource={require('./images/logo.png')}
              style={styles.image} />
            <Button title='Camera' buttonStyle={{ backgroundColor: '#512DA8', margin: 10 }} onPress={this.getImageFromCamera} />
            <Button title='Gallery' buttonStyle={{ backgroundColor: '#512DA8', margin: 10 }} onPress={this.getImageFromGallery} />
          </View>
          <Input placeholder=" Username"
            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
            onChangeText={username => this.setState({ username })}
            value={this.state.username}
            containerStyle={styles.formInput} />
          <Input placeholder=" Password"
            leftIcon={{ type: 'font-awesome', name: 'key' }}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            containerStyle={styles.formInput} />
          <Input placeholder=" First Name"
            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
            onChangeText={firstName => this.setState({ firstName })}
            value={this.state.firstName}
            containerStyle={styles.formInput} />
          <Input placeholder=" Last Name"
            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
            onChangeText={lastName => this.setState({ lastName })}
            value={this.state.lastName}
            containerStyle={styles.formInput} />
          <Input placeholder=" Email"
            leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
            containerStyle={styles.formInput} />
          <CheckBox title="Remember Me"
            center
            checked={this.state.remember}
            onPress={() => this.setState({ remember: !this.state.remember })}
            containerStyle={styles.formCheckbox} />
          <View style={styles.formButton}>
            <Button onPress={() => this.handleRegister()}
              title=" Register"
              icon={<Icon name='user-plus' type='font-awesome' size={24} color='white' />}
              buttonStyle={{ backgroundColor: "#512DA8" }} />
          </View>
        </View>
      </ScrollView >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  imageContainer: {
    justifyContent: 'space-around',
    flex: 1,
    flexDirection: 'row',
    margin: 20
  },
  image: {
    margin: 10,
    width: 80,
    height: 60
  },
  formInput: {
    margin: 20
  },
  formCheckbox: {
    margin: 20,
    backgroundColor: null
  },
  formButton: {
    margin: 20
  }
});

const Login = createBottomTabNavigator({
  Login: LoginTab,
  Register: RegisterTab
}, {
  tabBarOptions: {
    activeBackgroundColor: '#9575CD',
    inactiveBackgroundColor: '#D1C4E9',
    activeTintColor: 'white',
    inactiveTintColor: 'gray'
  }
});

export default Login;