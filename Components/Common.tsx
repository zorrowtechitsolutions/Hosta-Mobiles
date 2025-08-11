import React, { forwardRef } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TextInputProps,
  ButtonProps as RNButtonProps,
  TouchableOpacityProps,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // For back button icon

// Form Input Component
export const FormInput = ({
  id,
  OnChange,
  placeholder,
  type,
  value,
  className,
}: {
  type: string;
  value?: any;
  placeholder: string;
  OnChange: (text: string) => void;
  id?: string;
  name?: string;
  className?: any;
}) => {
  return (
    <TextInput
      value={value}
      onChangeText={OnChange}
      placeholder={placeholder}
      keyboardType={type === "email" ? "email-address" : "default"}
      style={[styles.input, className]}
    />
  );
};

// Back Button Component
interface BackButtonProps {
  onClick: () => void;
}

const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={styles.backButton}
      accessibilityLabel="Go back"
    >
      <MaterialIcons name="arrow-back" size={24} color="green" />
    </TouchableOpacity>
  );
};

// Header Component
interface HeaderProps {
  title: string;
  onBackClick: () => void;
}

export function Header({ title, onBackClick }: HeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <BackButton onClick={onBackClick} />
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
}

// Textarea Component
interface TextareaProps extends TextInputProps {}

const Textarea = forwardRef<TextInput, TextareaProps>(
  ({ style, ...props }, ref) => {
    return (
      <TextInput
        {...props}
        ref={ref}
        multiline
        numberOfLines={4}
        style={[styles.textarea, style]}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

// Review Button Component
export interface ReviewButtonProps extends TouchableOpacityProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  isLoading?: boolean;
  children?: React.ReactNode;
}

const ReviewButton = forwardRef<typeof TouchableOpacity, ReviewButtonProps>(
  (
    {
      variant = "default",
      size = "default",
      isLoading,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const buttonStyles = [
      styles.baseButton,
      variant === "default" && styles.defaultButton,
      variant === "outline" && styles.outlineButton,
      variant === "ghost" && styles.ghostButton,
      size === "default" && styles.defaultSize,
      size === "sm" && styles.smallSize,
      size === "lg" && styles.largeSize,
      isLoading && styles.loadingState,
      style, // Allow passing custom styles
    ];

    return (
      <TouchableOpacity
        // ref={ref}
        style={buttonStyles}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <ActivityIndicator
            color={variant === "default" ? "white" : "#66BB6A"}
          />
        ) : (
          <Text
            style={[
              variant === "default" ? styles.defaultText : styles.outlineText,
            ]}
          >
            {children}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
);

ReviewButton.displayName = "ReviewButton";

export { ReviewButton };

// Styles
const styles = StyleSheet.create({
  input: {
    paddingLeft: 10,
    width: "100%",
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#66BB6A",
    borderRadius: 8,
  },
  backButton: {
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop:10,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B5E20",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40, // Placeholder for alignment
  },
  textarea: {
    minHeight: 80,
    width: "100%",
    borderWidth: 1,
    borderColor: "#66BB6A",
    borderRadius: 8,
    padding: 8,
    textAlignVertical: "top",
  },
  baseButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  defaultButton: {
    backgroundColor: "#66BB6A",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#66BB6A",
    backgroundColor: "transparent",
  },
  ghostButton: {
    backgroundColor: "transparent",
  },
  defaultSize: {
    height: 40,
  },
  smallSize: {
    height: 36,
  },
  largeSize: {
    height: 48,
  },
  defaultText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  outlineText: {
    color: "#66BB6A",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingState: {
    opacity: 0.7,
  },
});
