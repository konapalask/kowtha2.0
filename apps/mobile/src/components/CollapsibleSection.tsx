import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

type CollapsibleSectionProps = {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  isValid: boolean;
  children: React.ReactNode;
};

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  isExpanded,
  onToggle,
  isValid,
  children,
}) => {
  const rotateAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(rotateAnimation, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  const rotate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          onToggle();
        }}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {isValid && (
            <Icon
              name="check"
              size={18}
              color="#34C759"
              style={styles.checkIcon}
            />
          )}
        </View>
        <Animated.View style={{transform: [{rotate}]}}>
          <Icon name="caretdown" size={18} color="#333" />
        </Animated.View>
      </TouchableOpacity>
      {isExpanded && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  checkIcon: {
    marginLeft: 8,
  },
  content: {
    padding: 0,
  },
});

export default CollapsibleSection;
