'use client'

import React, { useState } from 'react'
import { type FormSchema } from '@/lib/formSchema'
import { Label, LabelRequired } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

type FormRendererProps = {
    schema: FormSchema
}
export const FormRenderer: React.FC<FormRendererProps> = ({ schema }) => {
    const [formState, setFormState] = useState(
        schema.reduce((acc, field) => {
            if (field.defaultValue !== undefined) {
                acc[field.id] = field.defaultValue
            }
            return acc
        }, {} as Record<string, string | number | boolean>)
    )

    function handleChange(id: string, type: string) {
        return (
            event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
        ) => {
            let value: string | number | boolean

            switch (type) {
                case 'number':
                    value = (event.target as HTMLInputElement).valueAsNumber
                    break
                case 'boolean':
                    value = (event.target as HTMLInputElement).checked
                    break
                default:
                    value = event.target.value
            }

            setFormState({
                ...formState,
                [id]: value,
            })
        }
    }

    function handleSubmit(event: React.FormEvent): void {
        event.preventDefault()

        toast.success(<code>{JSON.stringify(formState, null, 2)}</code>, {
            duration: 10000,
            position: 'bottom-right',
        })
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {schema.map((field) => {
                switch (field.type) {
                    case 'string':
                    case 'number':
                        return (
                            <div key={field.id}>
                                <Label htmlFor={field.id}>
                                    {field.label}
                                    {field.required && <LabelRequired />}
                                </Label>

                                <Input
                                    id={field.id}
                                    type={field.type}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                    defaultValue={field.defaultValue}
                                    onChange={handleChange(
                                        field.id,
                                        field.type
                                    )}
                                />
                            </div>
                        )
                    case 'boolean':
                        return (
                            <div
                                key={field.id}
                                className="flex space-x-2 items-center"
                            >
                                <Checkbox
                                    id={field.id}
                                    defaultChecked={field.defaultValue}
                                    onChange={() =>
                                        handleChange(field.id, field.type)
                                    }
                                />
                                <Label htmlFor={field.id}>
                                    {field.label}
                                    {/* {field.required && <RequiredStar />} */}
                                </Label>
                            </div>
                        )
                    case 'select':
                        return (
                            <div key={field.id}>
                                {/* <Label required={field.required} htmlFor={field.id}>
                  {field.label}
                  {field.required && <RequiredStar />}
                </Label> */}

                                {/* <Select
                                    id={field.id}
                                    required={field.required}
                                    defaultValue={
                                        field.defaultValue ??
                                        field.options.at(0)?.value
                                    }
                                    onChange={handleChange(
                                        field.id,
                                        field.type
                                    )}
                                >
                                    {field.options.map((option) => (
                                        <Select
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </Select>
                                    ))}
                                </Select> */}
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a fruit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Fruits</SelectLabel>
                                            <SelectItem value="apple">
                                                Apple
                                            </SelectItem>
                                            <SelectItem value="banana">
                                                Banana
                                            </SelectItem>
                                            <SelectItem value="blueberry">
                                                Blueberry
                                            </SelectItem>
                                            <SelectItem value="grapes">
                                                Grapes
                                            </SelectItem>
                                            <SelectItem value="pineapple">
                                                Pineapple
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )
                    default:
                        return null
                }
            })}
            <Button type="submit">Submit</Button>
        </form>
    )
}
