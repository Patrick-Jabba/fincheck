import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { authService } from "../../../app/services/authService";

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

  // handleSubmit aqui é uma higher order function => função que retorna uma função
  const handleSubmit = hookFormHandleSubmit(async(data) =>{
    const { accessToken }= await authService.signup(data);

    console.log(accessToken);
  });

  return {handleSubmit, register, errors};
}