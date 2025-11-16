import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const RadioGroup = ({
  data = [],
  selectedValue,
  onPress,
  horizontal = false,
  labelStyle = {},
  circleSize = 18,
}) => {
  return (
    <View style={{flexDirection: horizontal ? 'row' : 'column'}}>
      {data.map((item, index) => {
        const isSelected = selectedValue === item.value;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onPress(item.value, index)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: horizontal ? 20 : 0,
              marginBottom: 10,
            }}>
            
            {/* Radio outer circle */}
            <View
              style={{
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
                borderWidth: 3,
                borderColor: '#18a0e4',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8,
              }}>

              {/* inner dot */}
              {isSelected && (
                <View
                  style={{
                    width: circleSize / 2,
                    height: circleSize / 2,
                    borderRadius: circleSize / 4,
                    backgroundColor: '#18a0e4',
                  }}
                />
              )}
            </View>

            {/* Label */}
            <Text style={[{color: 'black'}, labelStyle]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default RadioGroup;
