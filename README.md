## Filter Base Type File

in search bar component show icons file and in home page declare state activeFilter that list of string. in this list add and remove selected type file for filter. then in useMemo for FileList add activeFilter for get changes and then filter file than type exist in activeFilter.

```js
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
```

for pdf File because type is document, I changed type file to pdf so that I can do the correct filtering

## Edit Message

if the icon for edit click change the message box to edittext and set the old text in this area. after edit text i send new text and index message to the Home Component. and then I send New Message To Server For get new response and new edit text and response add to messages.
