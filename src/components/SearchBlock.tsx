import { Formik, Form, Field } from 'formik'
import { ENV } from '../lib/env'
import { mathifyElement } from '../lib/math'
import { useState, useCallback } from 'react'

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
  const [teacherContentOnly, setTeacherContentOnly] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalHitsDisplayed, setTotalHitsDisplayed] = useState(0)
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

  const contentRefCallback = useCallback((node: HTMLParagraphElement | null): void => {
    if (node != null) {
      mathifyElement(node)
    }
  }, [])

  const calculateTotalTeacherOnlyHits = (searchResults: SearchResults): void => {
    let totalTeacherOnlyHits: number = 0
    searchResults.hits.hits.forEach((hit) => {
      if (hit._source.teacher_only) {
        totalTeacherOnlyHits += 1
      }
    })
    setTotalHitsDisplayed(totalTeacherOnlyHits)
  }

  const handleSubmit = async (): Promise<void> => {
    if (query.trim() === '') {
      setErrorMessage('Input cannot be empty')
      return
    }
    setSearchResults(undefined)
    setErrorMessage('')
    setSearchTerm(query)
    setTeacherContentOnly(false)
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
                    <div className="spinner-border mt-3 text-primary" role="status">
                      <span className="visually-hidden">Searching...</span>
                    </div>
                  </div>
                </div>
              : <div className='os-raise-bootstrap os-text-center mt-4'>
                  <button type="submit" disabled={isSubmitting} className="os-btn btn-outline-primary">Search</button>
                </div>
            }
            {errorMessage !== '' && <p className='os-search-error-message'>{errorMessage}</p>}
          </Form>
        )}
      </Formik>
      {searchResults !== undefined && searchResults.hits.total.value !== 0 &&
        <>
        <div className='os-search-results-count-container'>
          <h3>Search Results</h3>
          <div>
            <p className='os-search-magnifying-glass'>Displaying {teacherContentOnly ? totalHitsDisplayed : searchResults.hits.hits.length} of out {searchResults.hits.total.value} results for <span className='os-raise-text-bold'>{searchTerm}</span></p>
            <div className='os-raise-d-flex-nowrap os-raise-justify-content-evenly os-search-teacher-content-toggle-container'>
              <p className='os-raise-mb-0'>Teacher Content Only</p>
              <div className='os-raise-bootstrap'>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" onChange={() => { setTeacherContentOnly(!teacherContentOnly); calculateTotalTeacherOnlyHits(searchResults) }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='os-search-results-container'>
          {teacherContentOnly
            ? <ul className='os-search-results-list'>
                {searchResults.hits.hits.map((hit) => (hit._source.teacher_only &&
                  <li className='os-search-results-list-item' id={hit._id}>
                    <div>
                      <h3>{'Teacher Content'}</h3>
                      {hit._source.teacher_only && hit.highlight.visible_content?.map((content: string) => (
                        <p ref={contentRefCallback} className='os-search-results-highlights' dangerouslySetInnerHTML={{ __html: content }}></p>
                      ))}
                      {hit._source.teacher_only && hit.highlight.lesson_page?.map((page: string) => (
                        <p ref={contentRefCallback} className='os-search-results-highlights' dangerouslySetInnerHTML={{ __html: page }}></p>
                      ))}
                      {hit._source.teacher_only && hit.highlight.activity_name?.map((activity: string) => (
                        <p ref={contentRefCallback} className='os-search-results-highlights' dangerouslySetInnerHTML={{ __html: activity }}></p>
                      ))}
                    </div>
                  </li>))}
              </ul>
            : <ul className='os-search-results-list'>
                {searchResults.hits.hits.map((hit) => (
                  <li className='os-search-results-list-item' id={hit._id}>
                    <div>
                      <h3>{hit._source.teacher_only ? 'Teacher Content' : 'Content'}</h3>
                      {hit.highlight.visible_content?.map((content: string) => (
                        <p ref={contentRefCallback} className='os-search-results-highlights' dangerouslySetInnerHTML={{ __html: content }}></p>
                      ))}
                      {hit.highlight.lesson_page?.map((page: string) => (
                        <p ref={contentRefCallback} className='os-search-results-highlights' dangerouslySetInnerHTML={{ __html: page }}></p>
                      ))}
                      {hit.highlight.activity_name?.map((activity: string) => (
                        <p ref={contentRefCallback} className='os-search-results-highlights' dangerouslySetInnerHTML={{ __html: activity }}></p>
                      ))}
                    </div>
                  </li>))}
              </ul>
          }
        </div>
      </>
      }
      {searchResults !== undefined && searchResults.hits.total.value === 0 &&
      <div className='os-search-results-count-container'>
        <h3>Search Results</h3>
        <div>
          <p className='os-search-magnifying-glass'>No results found for <span className='os-raise-text-bold'>{searchTerm}</span></p>
        </div>
      </div>
      }
    </div>
  )
}
