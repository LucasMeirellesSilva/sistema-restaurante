import { motion } from "framer-motion";
import { ZodError } from "zod";

type ErrorMessageProps = {
  error: unknown;
};

function ErrorMessage({ error }: ErrorMessageProps) {
  let messages: string[] = [];

  // Caso seja ZodError diretamente (ex.: no client)
  if (error instanceof ZodError) {
    messages = error.issues.map((i) => i.message);
  }

  // Caso venha do server: { message: ZodIssue[] }
  else if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    Array.isArray((error as any).message)
  ) {
    messages = (error as any).message.map((i: any) => i.message);
  }

  // Caso seja um Error comum
  else if (error instanceof Error) {
    messages = [error.message];
  }

  // fallback genérico
  if (messages.length === 0) {
    messages = ["Ocorreu um erro inesperado."];
  }

  return (
    <motion.div
      key={messages.join(",")}
      initial={{ x: -40 }}
      animate={{ x: [0, -2, 2, -2, 2, 0] }}
      transition={{ duration: 0.5 }}
    >
      <ul className="list-disc list-inside text-red-600 font-medium marker:text-xs space-y-1">
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </motion.div>
  );
}

export default ErrorMessage;
