import { useState, useRef, useEffect } from 'react'
import ReactSearchBox from 'react-search-box'
import { mathifyElement } from '../lib/math'

export interface DataItem {
  key: string
  value: string
}

export interface SearchBlockProperties {
  data: Map<string, string>
}

export const SearchBlock = ({ data }: SearchBlockProperties): JSX.Element => {
  const searchData = [...data.keys()].map(item => ({ key: item, value: item }))
  console.log([...data.keys()])
  const [selected, setSelected] = useState<DataItem | null>(null)

  const first = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (first.current === null) {
      return
    }
    mathifyElement(first.current).catch(error => console.error(error))
  }, [selected])

  const getValue = (dataItemReturned: DataItem | null): string => {
    if (dataItemReturned !== null) {
      return data.get(dataItemReturned.key) ?? ''
    }
    return ''
  }
  console.log(searchData)
  return (
    <>
    <ReactSearchBox
      placeholder=''
      data={searchData}
      onChange={ () => {} }
      onSelect={ record => {
        setSelected(record.item)
      } }
    />
    <div ref={first} dangerouslySetInnerHTML={{ __html: getValue(selected) }} />
    </>
  )
}
