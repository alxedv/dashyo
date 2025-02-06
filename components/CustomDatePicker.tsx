/*************  ✨ Codeium Command 🌟  *************/
"use client"
import * as React from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"

export function CustomDatePicker({ form }) {
  return (
    <FormField
      control={form.control}
      name="visitDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="form-label">Data da visita</FormLabel>
          <FormControl>
            <Input
              type="date"
              value={
                field.value
                  ? new Date(field.value).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => {
                field.onChange(
                  new Date(`${e.target.value}T00:00:00.000Z`).toISOString()
                )

              }}
            />
          </FormControl>
          <FormMessage className="form-message mt-2" />
        </FormItem>
      )}
    />
  )
}
