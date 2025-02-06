import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const CustomSelect = ({
  form,
  name,
  items,
  placeholder,
  label,
  className = "",
  handleChange,
  index,
  inputValue,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="form-label">{label}</FormLabel>
          <Select value={inputValue} onValueChange={(value) => handleChange(value, index, name)} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white">
              {items.map((item, index) => (
                <SelectItem key={`item-${index}`} className="cursor-pointer hover:shadow-inner" value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="form-message mt-2" />
        </FormItem>
      )}
    />
  )
}

export default CustomSelect