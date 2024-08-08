import { z } from "zod";
import toast from "react-hot-toast";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { authService } from "../../../app/services/authService";
import { SigninParams } from "../../../app/services/authService/signin";

const schema = z.object({
  email: z.string().min(1, 'Preencha este campo').email('Informe um e-mail válido.'),
  password: z.string().min(8, 'A senha é obrigatória e contém no mínimo 8 caracteres'),
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

const { mutateAsync, isPending } = useMutation({
  mutationFn: async(data: SigninParams) => {

  return authService.signin(data);
},
});

// handleSubmit aqui é uma higher order function => função que retorna uma função
const handleSubmit = hookFormHandleSubmit(async(data) =>{
try {
  const { accessToken } = await mutateAsync(data);
  toast.success('Login efetuado com sucesso!')
} catch (error) {
  toast.error('Credenciais inválidas!')
}


});

  return { handleSubmit, register, errors, isPending };
}