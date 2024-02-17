'use client'
import { Button } from '@/components/ui/button'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { jsonSchema } from '@/lib/formSchema'
import { isValidJSON } from '@/lib/jsonValidation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function Home() {
    const [schema, setSchema] = useState<any | null>(null)

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

        const result = isValidJSON(value)
        if (!result.success) {
            toast.error(result.error)
            return
        }

        const parsedSchema = jsonSchema.safeParse(result.data)
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
                        <div className="flex flex-[0.5] flex-col h-[200px] p-6 space-y-6">
                            <Textarea
                                autoFocus={true}
                                placeholder="Enter the JSON schema"
                                id="schema"
                                className="flex-1"
                            />
                            <Button
                                variant={'outline'}
                                type="submit"
                                className=""
                            >
                                Submit
                            </Button>
                        </div>
                    </form>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={70}></ResizablePanel>
            </ResizablePanelGroup>
        </main>
    )
}
