import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { httpClient } from "../../../app/services/httpClient";

const schema = z.object({
  email: z.string().min(1, 'Preencha este campo').email('Informe um e-mail válido.'),
  password: z.string().min(8, 'A senha é obrigatória e deve conter no mínimo 8 caracteres'),
});

type FormData = z.infer<typeof schema>;

export function useLoginController(){
  const { 
    register,
    handleSubmit: hookFormHandleSubmit,
    formState: { errors },
} = useForm<FormData>({
  resolver: zodResolver(schema),
});

  // handleSubmit aqui é uma higher order function => função que retorna uma função
  const handleSubmit = hookFormHandleSubmit(async (data) =>{
    await httpClient.post('/auth/signin', data);
  });

  return {handleSubmit, register, errors};
}