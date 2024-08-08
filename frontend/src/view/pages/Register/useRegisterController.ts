import { z } from "zod";
import toast from "react-hot-toast";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod"

import { authService } from "../../../app/services/authService";
import { SignupParams } from "../../../app/services/authService/signup";

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório.'),
  email: z.string().min(1, 'Preencha este campo').email('Informe um e-mail válido.'),
  password: z.string().min(8, 'A senha é obrigatória e deve conter no mínimo 8 caracteres'),
});

type FormData = z.infer<typeof schema>;

export function useRegisterController(){
  const { 
    register,
    formState: { errors },
    handleSubmit: hookFormHandleSubmit,
} = useForm<FormData>({
    resolver: zodResolver(schema),
});

  const { mutateAsync, isPending } = useMutation({
      mutationFn: async(data: SignupParams) => {

      return authService.signup(data);
    },
  });

  // handleSubmit aqui é uma higher order function => função que retorna uma função
  const handleSubmit = hookFormHandleSubmit(async(data) =>{
    try {
      const { accessToken } = await mutateAsync(data);
      toast.success('Conta criada com sucesso!')
      console.log(accessToken)
    } catch (error) {
      toast.error('Ocorreu um erro ao criar sua conta!')
    }


  });

  return { handleSubmit, register, errors, isPending };
}