// src/app/components/ErrorMessage.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  title: string;
  description: string;
}

const ErrorMessage = ({ title, description }: ErrorMessageProps) =>{
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}


export default ErrorMessage;