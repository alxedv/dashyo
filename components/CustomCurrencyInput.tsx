import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

type TextInputProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  className: string;
  inputValue: any;
  handleChange?: (value: number, index: number, key: string) => void;
  index: number;
};

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function CustomCurrencyInput({
  form,
  name,
  label,
  placeholder,
  className,
  inputValue,
  handleChange,
  index,
}: TextInputProps) {

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type="text"
              onChange={(ev) => {
                const digits = ev.target.value.replace(/\D/g, "");
                const realValue = Number(digits) / 100;
                field.onChange(realValue); // Atualiza o valor real no form

                // Atualiza o valor real usando handleChange, se fornecido
                if (handleChange) {
                  handleChange(realValue, index, name);
                }
              }}
              value={moneyFormatter.format(field.value || inputValue || 0)} // Exibe o valor formatado
            />
          </FormControl>
          <FormMessage className="form-message mt-2" />
        </FormItem>
      )}
    />
  );
}
