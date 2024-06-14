import { Avatar, Button, Textarea } from '@nextui-org/react'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useAnimatedText } from '../AnimatedText'
import { EditIcon } from '../icons'

export type ChatMessageProps = Omit<React.HTMLProps<HTMLDivElement>, 'role'> & {
  message: string
  role: 'user' | 'assistant'
  disableAnimation?: boolean
  index: number
  handleSendEditText: (text: string, index: number) => void
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  role,
  disableAnimation = false,
  index,
  handleSendEditText,
  ...props
}) => {
  const content = useAnimatedText(message, {
    maxTime: 1000,
    disabled: role === 'user' || disableAnimation,
  })

  const [enableEdit, setEnableEdit] = useState(false)
  const [editedText, setEditedText] = useState('')

  const handleEdit = () => {
    setEditedText(message)
    setEnableEdit(true)
  }

  const CancelEdit = () => {
    setEditedText('')
    setEnableEdit(false)
  }

  const SendEditText = () => {
    handleSendEditText(editedText, index)
    setEditedText('')
    setEnableEdit(false)
  }

  return (
    <div {...props} className={clsx('', props.className)}>
      <div className="flex flex-row gap-4 items-start">
        <Avatar
          className="flex-shrink-0"
          showFallback
          color={role === 'assistant' ? 'primary' : 'default'}
          name={role === 'assistant' ? 'A' : ''}
          classNames={{
            name: 'text-[16px]',
          }}
        />
        {enableEdit ? (
          <form className="flex-grow shadow-sm mt-[-4px]">
            <Textarea
              size="lg"
              minRows={1}
              maxRows={8}
              value={editedText}
              variant="bordered"
              placeholder="Type a message..."
              classNames={{
                inputWrapper: 'border-gray-100 hover:border-gray-100',
              }}
              onValueChange={(value) => setEditedText(value)}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button
                className=""
                color="primary"
                size="md"
                type="submit"
                onClick={SendEditText}
              >
                Send
              </Button>
              <Button className="" size="md" type="submit" onClick={CancelEdit}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex-grow border border-gray-200 rounded-lg p-4 text-md bg-white shadow-sm mt-[-4px]">
              <div
                className="whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
            {role == 'user' && <EditIcon onClick={handleEdit} />}
          </>
        )}
      </div>
    </div>
  )
}
