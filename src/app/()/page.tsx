'use client'
import { Button } from '@/components/ui/button'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { FormSchema, formSchema } from '@/lib/formSchema'
import { isValidJSON } from '@/lib/jsonValidation'
import { useState } from 'react'
import { toast } from 'sonner'
import { FormRenderer } from './components/FormRenderer'

export default function Home() {
    const [schema, setSchema] = useState<FormSchema | null>(null)

    function onSubmit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault()
        const value = (
            e.currentTarget.elements.namedItem(
                'schema'
            ) as HTMLTextAreaElement | null
        )?.value
        if (value === undefined) {
            toast.error('Value is undefined')
            return
        }

        // Check if form input is valid JSON
        const result = isValidJSON(value)
        if (!result.success) {
            toast.error(result.error)
            return
        }

        // Check if form input satisfies predefined schema
        const parsedSchema = formSchema.safeParse(result.data)
        if (!parsedSchema.success) {
            toast.error(
                `Invalid schema: ${parsedSchema.error
                    .flatten()
                    .formErrors.join(', ')}`
            )

            return
        }

        setSchema(parsedSchema.data)
    }
    return (
        <main className="w-full flex">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={30} minSize={30} maxSize={70}>
                    <form className="flex flex-col h-full" {...{ onSubmit }}>
                        <div className="flex flex-col p-6 space-y-6">
                            <Textarea
                                autoFocus={true}
                                placeholder="Enter the JSON schema"
                                id="schema"
                                className="max-h-[780px] h-[400px]"
                            />
                            <Button
                                variant={'outline'}
                                type="submit"
                                className=""
                            >
                                Create form &gt;
                            </Button>
                        </div>
                    </form>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={70} minSize={30}>
                    <div className="flex h-full items-center p-10 justify-center">
                        <div className="max-w-[500px] flex-1">
                            {schema !== null && (
                                <FormRenderer
                                    schema={schema}
                                    key={JSON.stringify(schema)}
                                />
                            )}
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    )
}
