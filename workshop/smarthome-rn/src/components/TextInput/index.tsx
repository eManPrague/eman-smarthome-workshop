import * as React from 'react';
import {
  TextInput,
  Platform,
  KeyboardTypeIOS
} from 'react-native';

const Input = (props: components.ITextInput) => {
  const { style, placeholder, value, onChangeText, keyboardType, onSubmitEditing, blurOnSubmit, ref } = props;

  if (keyboardType == "numbers") {
    if (Platform.OS === "ios") {
      return (
        <TextInput 
          style={style} 
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={"decimal-pad"}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
          ref={ref}
        />
      );
    }
    return (
      <TextInput 
        style={style} 
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={"phone-pad"}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={blurOnSubmit}
        ref={ref}
      />
    );
  }

  return (
    <TextInput 
      style={style} 
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      onSubmitEditing={onSubmitEditing}          
      blurOnSubmit={blurOnSubmit}
      ref={ref}
    />
  );
}

export default Input;
