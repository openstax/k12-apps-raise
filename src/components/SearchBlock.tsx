import { Formik, Form, Field } from 'formik'
import { ENV } from '../lib/env'
import { mathifyElement } from '../lib/math'
import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface SearchBlockProps {
  versionId: string
  getFilter: () => Promise<string | undefined>
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

type UnitHits = Record<string, Hit[]>

export const SearchBlock = ({ versionId, getFilter }: SearchBlockProps): JSX.Element => {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResults | undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState('')
  const [studentContentOnly, setStudentContentOnly] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalStudentHitsOnly, setTotalStudentHitsOnly] = useState(0)
  const [groupedStudentTeacherHits, setGroupedStudentTeacherHits] = useState<UnitHits | undefined>(undefined)
  const [groupedStudentHits, setGroupedStudentHits] = useState<UnitHits | undefined>(undefined)
  const [sortedHits, setSortedHits] = useState<UnitHits | undefined>(undefined)
  const [currentFilter, setCurrentFilter] = useState<string | undefined>(undefined)
  const fetchContent = async (): Promise<void> => {
    try {
      const filter = await getFilter()
      const response = filter !== undefined
        ? await fetch(`${ENV.OS_RAISE_SEARCHAPI_URL_PREFIX}/v1/search?q=${query}&version=${versionId}&filter=${filter}`)
        : await fetch(`${ENV.OS_RAISE_SEARCHAPI_URL_PREFIX}/v1/search?q=${query}&version=${versionId}`)

      if (!response.ok) {
        throw new Error('Failed to get search results')
      }

      const data: SearchResults = await response.json()
      setSearchResults(data)
      calculateTotalStudentOnlyHits(data)
      groupHitsByUnit(data)
      setCurrentFilter(filter)
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

  const calculateTotalStudentOnlyHits = (searchResults: SearchResults): void => {
    let totalStudentOnlyHits: number = 0
    searchResults.hits.hits.forEach((hit) => {
      if (!hit._source.teacher_only) {
        totalStudentOnlyHits += 1
      }
    })
    setTotalStudentHitsOnly(totalStudentOnlyHits)
  }

  const groupHitsByUnit = (searchResults: SearchResults): void => {
    if (searchResults === undefined) {
      return
    }
    const unitStudentTeacherHits: UnitHits = {}
    const unitStudentHits: UnitHits = {}

    searchResults.hits.hits.forEach((hit) => {
      const unitName = hit._source.section

      if (!hit._source.teacher_only) {
        if (unitName in unitStudentHits) {
          unitStudentHits[unitName].push(hit)
        } else {
          unitStudentHits[unitName] = [hit]
        }
      }

      if (unitName in unitStudentTeacherHits) {
        unitStudentTeacherHits[unitName].push(hit)
      } else {
        unitStudentTeacherHits[unitName] = [hit]
      }
    })

    setGroupedStudentTeacherHits(unitStudentTeacherHits)
    setGroupedStudentHits(unitStudentHits)
    studentContentOnly ? setSortedHits(unitStudentHits) : setSortedHits(unitStudentTeacherHits)
  }

  const handleSubmit = async (): Promise<void> => {
    if (query.trim() === '') {
      setErrorMessage('Input cannot be empty')
      return
    }
    setSearchResults(undefined)
    setErrorMessage('')
    setSearchTerm(query)
    setStudentContentOnly(false)
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
              : <div className='os-raise-bootstrap'>
                  <div className='os-text-center mt-4'>
                    <button type="submit" disabled={isSubmitting} className="os-btn btn-outline-primary">Search</button>
                  </div>
                </div>
            }
            {errorMessage !== '' && <p className='os-search-error-message'>{errorMessage}</p>}
          </Form>
        )}
      </Formik>
      {searchResults !== undefined && searchResults.hits.total.value !== 0 &&
        <>
          <div className='os-search-results-count-container'>
            <h3 className='os-search-heading'>Search Results</h3>
            <div>
              <p className='os-search-magnifying-glass os-search-results-text'>
                Displaying {studentContentOnly ? totalStudentHitsOnly : searchResults.hits.hits.length} of out {searchResults.hits.total.value} results for <span className='os-raise-text-bold'>{searchTerm}</span>
              </p>
              {currentFilter === undefined &&
                <div className='os-raise-d-flex-nowrap os-raise-justify-content-evenly os-search-student-content-toggle-container'>
                  <p className='os-raise-mb-0 os-search-results-text'>Student Content Only</p>
                  <div className='os-raise-bootstrap'>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckDefault"
                        onChange={() => {
                          setStudentContentOnly(!studentContentOnly)
                          !studentContentOnly ? setSortedHits(groupedStudentHits) : setSortedHits(groupedStudentTeacherHits)
                        }}
                      />
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
          {sortedHits !== undefined &&
            <div className='os-search-results-container'>
              <div className='os-raise-bootstrap'>
                <div className="accordion" id="contentAccordion">
                  {Object.keys(sortedHits).sort().map((unitName) => {
                    const uniqueId = `auto-${uuidv4()}`
                    return (
                      <div className="accordion-item" key={unitName}>
                        <h3 className="accordion-header">
                          <button
                            className="accordion-button collapsed os-raise-text-bold"
                            type="button" data-bs-toggle="collapse"
                            data-bs-target={`#${uniqueId}`}
                            aria-expanded="false"
                            aria-controls={uniqueId}
                          >
                            {unitName}
                          </button>
                        </h3>
                        <div id={uniqueId} className="accordion-collapse collapse" data-bs-parent="#contentAccordion">
                          <div className="accordion-body">
                            {sortedHits[unitName].map((hit: Hit) => {
                              return (
                                <div className='os-search-hit' key={hit._id}>
                                  <p className='os-raise-text-bold os-search-results-text'>{hit._source.activity_name}</p>
                                  <p className='os-raise-text-bold os-search-results-text'>{hit._source.lesson_page}</p>
                                  <p className='os-search-content-type'>{hit._source.teacher_only ? 'Teacher Content' : 'Student Content'}</p>
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
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          }
        </>
      }
      {searchResults !== undefined && searchResults.hits.total.value === 0 &&
        <div className='os-search-results-count-container'>
          <h3 className='os-search-heading'>Search Results</h3>
          <div>
            <p className='os-search-magnifying-glass os-search-results-text'>No results found for <span className='os-raise-text-bold'>{searchTerm}</span></p>
          </div>
        </div>
      }
    </div>
  )
}
