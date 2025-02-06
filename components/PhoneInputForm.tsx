import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
import { PhoneInput } from "./PhoneInput";

const FormSchema = z.object({
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});

export default function PhoneInputForm({ form }) {
  return (
    <Form {...form}>
      <form
        className="space-y-8 flex flex-col items-start">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="form-label">Telefone</FormLabel>
              <FormControl className="w-full">
                <PhoneInput defaultCountry="BR" placeholder="Digite o número" {...field} />
              </FormControl>
              <FormMessage className="form-message mt-2" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}