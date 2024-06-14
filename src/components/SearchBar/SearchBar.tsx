import { Button, Chip, Input, InputProps } from '@nextui-org/react'
import clsx from 'clsx'
import React from 'react'
import {
  AudioFileIcon,
  DraftIcon,
  ImageIcon,
  PdfFileIcon,
  SearchIcon,
  VideoFileIcon,
} from '../icons'

const iconMap = {
  Document: DraftIcon,
  PDF: PdfFileIcon,
  Image: ImageIcon,
  Audio: AudioFileIcon,
  Video: VideoFileIcon,
}

export type SearchBarProps = Omit<
  React.HTMLProps<HTMLDivElement>,
  'value' | 'onChange'
> & {
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  pending?: boolean

  inputProps?: InputProps
  formProps?: React.HTMLProps<HTMLFormElement>

  filters?: string[]
  onHandleActiveFilter: (nameFilter: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  pending = false,
  onChange,
  onSubmit,
  inputProps = {},
  formProps = {},
  className,
  filters,
  onHandleActiveFilter,
  ...props
}) => {
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(e)
    }
  }

  return (
    <div className={clsx('w-full', className)} {...props}>
      <form
        className={clsx(formProps.className, 'w-full flex items-center gap-2')}
        onSubmit={onFormSubmit}
        {...formProps}
      >
        <Input
          placeholder="Search..."
          variant="bordered"
          radius="none"
          value={value}
          onChange={onChange}
          className={clsx(inputProps.className)}
          {...inputProps}
        />
        <Button
          isIconOnly
          radius="none"
          variant="solid"
          color="primary"
          className="fill-white"
          type="submit"
          isLoading={pending}
        >
          <SearchIcon />
        </Button>
      </form>

      <div className="flex flex-row justify-center gap-2 my-[24px]">
        {Object.keys(iconMap).map((item) => {
          const IconComponent = iconMap[item as keyof typeof iconMap]
          return (
            <Chip
              key={item}
              variant="shadow"
              size="lg"
              classNames={{
                base: filters?.includes(item.toLocaleLowerCase())
                  ? 'bg-gray-300 border-white/50'
                  : 'bg-white border-white/50',
                content: 'text-black',
              }}
              radius="full"
              className="cursor-pointer"
              onClick={() => onHandleActiveFilter(item)}
            >
              <span className="flex flex-row items-center gap-[6px]">
                <IconComponent color="red" className="fill-primary" />
                <span className="flex items-center justify-center text-[16px] text-black">
                  {item}
                </span>
              </span>
            </Chip>
          )
        })}
      </div>
    </div>
  )
}
