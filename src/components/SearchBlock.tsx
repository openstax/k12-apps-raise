import { Formik, Form, Field } from 'formik'
import { ENV } from '../lib/env'
import { useState } from 'react'

interface SearchBlockProps {
  versionId: string
  filter?: string
}

interface HitValue {
  value: number
}

interface HitSource {
  section: string
  activity_name: string
  lesson_page: string
  teacher_only: boolean
}

interface HitHighlight {
  lesson_page?: string[]
  visible_content?: string[]
  activity_name?: string[]
}

interface Hit {
  _id: string
  _source: HitSource
  highlight: HitHighlight
}

interface Hits {
  total: HitValue
  hits: Hit[]
}

interface SearchResults {
  hits: Hits
}

export const SearchBlock = ({ versionId, filter }: SearchBlockProps): JSX.Element => {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResults | undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState('')
  const fetchContent = async (): Promise<void> => {
    try {
      const response = filter !== undefined
        ? await fetch(`${ENV.OS_RAISE_SEARCHAPI_URL_PREFIX}/v1/search?q=${query}&version=${versionId}&filter=${filter}`)
        : await fetch(`${ENV.OS_RAISE_SEARCHAPI_URL_PREFIX}/v1/search?q=${query}&version=${versionId}`)

      if (!response.ok) {
        throw new Error('Failed to get search results')
      }

      const data: SearchResults = await response.json()
      setSearchResults(data)
    } catch (error) {
      setErrorMessage('Failed to get search results, please try again.')
      console.error('Error fetching search results:', error)
    }
  }

  const handleSubmit = async (): Promise<void> => {
    if (query.trim() === '') {
      setErrorMessage('Input cannot be empty')
      return
    }
    setSearchResults(undefined)
    setErrorMessage('')
    await fetchContent()
  }
  return (
    <div>
      <Formik
        initialValues={{ response: '' }}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className='os-search-form'>
            <Field
              name="response"
              type='text'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setQuery(e.target.value)
                setErrorMessage('')
                void setFieldValue('response', e.target.value)
              }}
              disabled={isSubmitting}
            />
            {isSubmitting
              ? <div className="os-raise-bootstrap">
                  <div className="text-center">
                    <div className="spinner-border mt-3 text-success" role="status">
                      <span className="visually-hidden">Searching...</span>
                    </div>
                  </div>
                </div>
              : <div className='os-raise-bootstrap os-text-center mt-4'>
                  <button type="submit" disabled={isSubmitting} className="os-btn btn-outline-success">Search</button>
                </div>
            }
            {errorMessage !== '' && <p className='os-search-error-message'>{errorMessage}</p>}
          </Form>
        )}
      </Formik>
      {searchResults !== undefined && searchResults.hits.total.value !== 0 &&
        <div className='os-search-results-container'>
          <p>Total search results: {searchResults.hits.total.value}</p>
          <p>Total search results displayed: {searchResults.hits.hits.length}</p>
          <ul className='os-search-results-list'>
            {searchResults.hits.hits.map((hit) => (
              <li className='os-search-results-list-item' key={hit._id}>
                <div>
                  <h3>Location</h3>
                  <p>{hit._source.section}</p>
                  <p>{hit._source.activity_name}</p>
                  <p>{hit._source.lesson_page !== '' && hit._source.lesson_page}</p>
                </div>
                <div>
                  {/* The keys for each item below are generated using the item's index in the array */}
                  <h3>{hit._source.teacher_only ? 'Teacher Content' : 'Content'}</h3>
                  {hit.highlight.visible_content?.map((content: string) => (
                    <p className='os-search-results-highlights' dangerouslySetInnerHTML={{ __html: content }}></p>
                  ))}
                  {hit.highlight.lesson_page?.map((page: string) => (
                    <p className='os-search-results-highlights' dangerouslySetInnerHTML={{ __html: page }}></p>
                  ))}
                  {hit.highlight.activity_name?.map((activity: string) => (
                    <p className='os-search-results-highlights' dangerouslySetInnerHTML={{ __html: activity }}></p>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      }
      {searchResults !== undefined && searchResults.hits.total.value === 0 &&
        <div>
          <p className='os-search-no-results-message'>Your query did not produce any results. Please try again.</p>
        </div>
      }
    </div>
  )
}
