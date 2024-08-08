import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

//classname
export function cn(...inputs: ClassValue[]){
  return twMerge(clsx(inputs));
}