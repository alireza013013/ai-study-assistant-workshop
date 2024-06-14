import { ChatMessages } from '@/components/ChatMessages'
import { MessageBar } from '@/components/MessageBar'
import { Search } from '@/components/Search'
import { ChatLayout } from '@/layouts/ChatLayout/Chat.layout'
import { useSearch } from '@/queries/useSearch'
import { ApiChatMessage, chatApi } from '@/services/api'
import { FileData } from '@/types/data.types'
import { populateDirs } from '@/utils/populateDirs.util'
import React, { useEffect, useMemo, useState } from 'react'

export type HomePageProps = React.HTMLProps<HTMLDivElement>

export const HomePage: React.FC<HomePageProps> = ({ className, ...props }) => {
  const [query, setQuery] = useState('')
  const [prompt, setPrompt] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [messages, setMessages] = useState<ApiChatMessage[]>([])
  const [generating, setGenerating] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string[]>([])

  const search = useSearch(
    { query },
    {
      cacheTime: 0,
      enabled: false,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  )

  const fileList = useMemo(() => {
    let filtersFile: FileData[] = []
    if (activeFilter.length != 0) {
      search.data?.files.forEach((file) => {
        if (file.type == 'document') {
          if (file.extension?.includes('pdf')) {
            file.type = 'pdf'
          }
        }
        if (activeFilter.includes(file.type.toLocaleLowerCase())) {
          filtersFile.push(file)
        }
      })
    } else {
      filtersFile = search.data?.files as FileData[]
    }
    return populateDirs(filtersFile || [])
  }, [search.data, activeFilter])

  const onSearch = async () => {
    search.refetch()
  }

  const onPrompt = async (prompt: string) => {
    setGenerating(true)

    setMessages((value) => [
      ...value,
      {
        role: 'user',
        message: prompt,
      },
    ])

    const { message } = await chatApi({
      prompt,
      files: fileList.filter((f) => selectedFiles.includes(f.id)),
      history: messages,
    })
    setGenerating(false)
    setMessages((value) => [...value, message])
    setPrompt('')
  }

  useEffect(() => {
    setSelectedFiles([])
  }, [search.data])

  useEffect(() => {
    onSearch()
  }, [])

  const handleFilters = (nameFilter: string) => {
    if (activeFilter.includes(nameFilter.toLowerCase())) {
      setActiveFilter(
        activeFilter.filter((item) => item !== nameFilter.toLowerCase()),
      )
    } else {
      setActiveFilter([...activeFilter, nameFilter.toLowerCase()])
    }
  }

  const editMessages = async (newText: string, index: number) => {
    setGenerating(true)

    setMessages((value) => [
      ...value,
      {
        role: 'user',
        message: newText,
      },
    ])

    const { message } = await chatApi({
      prompt,
      files: fileList.filter((f) => selectedFiles.includes(f.id)),
      history: messages,
    })
    setGenerating(false)
    setMessages((value) => [...value, message])
    setPrompt('')
  }

  return (
    <ChatLayout
      messageBar={
        <MessageBar
          hide={selectedFiles.length === 0}
          prompt={prompt}
          onPromptChange={setPrompt}
          onSubmit={(prompt) => onPrompt(prompt)}
          loading={generating}
          disabled={generating}
        />
      }
    >
      <Search
        compact={messages.length > 0}
        searching={search.isFetching}
        query={query}
        onQueryChange={(v) => setQuery(v)}
        onSearch={onSearch}
        results={fileList}
        onSelect={(selected) => setSelectedFiles(selected)}
        selectedFiles={selectedFiles}
        filters={activeFilter}
        onHandleFilter={(nameFilter) => {
          handleFilters(nameFilter)
        }}
      />
      <ChatMessages
        className="py-[20px]"
        data={messages.map((msg) => ({
          role: msg.role,
          message: msg.message,
        }))}
        onHanleEditedMessage={editMessages}
      />
    </ChatLayout>
  )
}
