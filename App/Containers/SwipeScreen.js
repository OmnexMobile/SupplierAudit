// App.js

import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

class SwipeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      unlocked: false,
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: this.state.pan.x }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, { dx }) => {
        if (dx > SCREEN_WIDTH * 0.5) {
          this.setState({ unlocked: true });
          this.handleUnlock();
        } else {
          Animated.spring(this.state.pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    });
  }

  handleUnlock = () => {
    Animated.timing(this.state.pan, {
      toValue: { x: SCREEN_WIDTH, y: 0 },
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  render() {
    const { pan, unlocked } = this.state;

    return (
      <View style={styles.container}>
        {!unlocked ? (
          <View style={styles.lockContainer}>
            <Text style={styles.text}>Swipe to unlock</Text>
            <Animated.View
              {...this.panResponder.panHandlers}
              style={[pan.getLayout(), styles.slider]}
            >
              <Text style={styles.sliderText}>→</Text>
            </Animated.View>
          </View>
        ) : (
          <View style={styles.unlockedContainer}>
            <Text style={styles.unlockedText}>Unlocked!</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  lockContainer: {
    width: SCREEN_WIDTH * 0.8,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  text: {
    position: 'absolute',
    fontSize: 18,
    color: '#000',
  },
  slider: {
    width: 60,
    height: 60,
    backgroundColor: '#1E90FF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderText: {
    fontSize: 24,
    color: '#fff',
  },
  unlockedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedText: {
    fontSize: 24,
    color: '#4CAF50',
  },
});

export default SwipeScreen;
