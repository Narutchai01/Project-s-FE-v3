export interface ButtonProps {
    title: string;
    className: string;
    textSize?: string;
    onPress?: () => void;
    disabled?: boolean; 
}

export interface BackButtonProps {
    title: string;
    textSize: string;
}