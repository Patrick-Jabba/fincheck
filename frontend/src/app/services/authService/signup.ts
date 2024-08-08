import { httpClient } from "../httpClient";

interface SignupParams {
  name: string,
  email: string,
  password: string
}

interface SignupParams {
  accessToken: string;
}

export async function signup(params: SignupParams){
  const { data } =  await httpClient.post<SignupParams>('/auth/signup', params);

  return data;
}