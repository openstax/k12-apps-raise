import { Formik, Form, Field, ErrorMessage } from 'formik'
import { ENV } from '../lib/env'
import React, { useState } from 'react'
// Determine the neccessity of ErrorMessage component from formik

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
  visible_content: string[]
  activity_name: string[]
}

interface HitIdSourceHighlight {
  _id: string
  _source: HitSource
  highlight: HitHighlight
}

interface HitTotalHits {
  total: HitValue
  hits: HitIdSourceHighlight[]
}

interface Hits {
  hits: HitTotalHits
}

export const SearchBlock = ({ versionId, filter }: SearchBlockProps): JSX.Element => {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Hits | undefined>(undefined)
  const fetchContent = async (): Promise<void> => {
    // Confirm the final url to be fetched
    const response = await fetch(`${ENV.OS_RAISE_SEARCHAPI_URL_PREFIX}?q=${query}&version_id=${versionId}&filter=${filter}`)

    if (!response.ok) {
      throw new Error('Failed to get search results')
    }

    const data: Hits = await response.json()
    // const data: Hits = {
    //   hits: {
    //     total: {
    //       value: 34
    //     },
    //     hits: [
    //       {
    //         _id: '1a9844da-0262-49c0-9194-1496f9cfc4ed',
    //         _source: {
    //           section: 'Unit 4: Functions',
    //           activity_name: 'Lesson 4.16: Different Types of Sequences',
    //           lesson_page: '4.16.3: A Sequence Is a Type of Function',
    //           teacher_only: true
    //         },
    //         highlight: {
    //           lesson_page: [
    //             '4.16.3: A Sequence <strong>Is</strong> a Type of Function'
    //           ],
    //           visible_content: [
    //             'Activity \n<strong>Jada</strong> and Mai are trying to decide what type of sequence this could be:\n\n\n\n\nterm number\nvalue',
    //             '2\n      \n\n\n\n      2\n      \n\n        6\n      \n\n\n\n        5\n      \n\n        18\n      \n\n\n\n<strong>Jada</strong>',
    //             'says: \u201cI think this sequence <strong>is</strong> geometric because in the value column, each row <strong>is</strong> 3 times the previous',
    //             'Do you agree with <strong>Jada</strong> or Mai? Be prepared to show your reasoning using a graph.',
    //             '<strong>Jada</strong> noticed that each value <strong>is</strong> multiplied by 3 to get to the next row, but the table skips terms.'
    //           ]
    //         }
    //       },
    //       {
    //         _id: 'f27ad080-9923-48c5-9355-54e4934a95d8',
    //         _source: {
    //           section: 'Unit 4: Functions',
    //           activity_name: 'Lesson 4.14: Sequences',
    //           lesson_page: '4.14.2: What Is a Sequence?',
    //           teacher_only: false
    //         },
    //         highlight: {
    //           lesson_page: [
    //             '4.14.2: What <strong>Is</strong> a Sequence?'
    //           ],
    //           visible_content: [
    //             'What <strong>is</strong> the smallest number of moves in which you are able to complete the puzzle with 3 discs?',
    //             'Enter your answer here:\n\n\nCompare your answer:\n15 moves\n\n\n\n\n\n\n\n\n\n<strong>Jada</strong> says she used the solution for',
    //             'Enter your answer here:\n\n\nCompare your answer:\n<strong>Jada</strong> moved the tower of discs 1\u20133, then moved disc 4,',
    //             'The number of moves <strong>is</strong> 31 because \\(2\\cdot15+1=31\\).',
    //             'The term (of a sequence) <strong>is</strong> one of the numbers in a sequence.'
    //           ]
    //         }
    //       }
    //     ]
    //   }
    // }
    setSearchResults(data)
  }
  return (
    <div>
      <Formik
        initialValues={{ response: '' }}
        onSubmit={fetchContent}
      >
        {({ setFieldValue }) => (
          <Form className='os-search-form'>
            <Field
              name="response"
              type='text'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setQuery(e.target.value)
                void setFieldValue('response', e.target.value)
              }}
            />
            <ErrorMessage className="text-danger my-3" component="div" name="response" />
            <div className='os-text-center mt-4'>
              <button type="submit" className="os-btn btn-outline-primary os-search-button">Button</button>
            </div>
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
                  <h3>Results</h3>
                  <p>{hit._source.teacher_only && `This is ${filter} content`}</p>
                  {hit.highlight.visible_content.map((content: string) => (
                    <p className='os-search-results-highlights' dangerouslySetInnerHTML={{ __html: content }}></p>
                  ))}
                  {hit.highlight.lesson_page?.map((page: string) => (
                    <p className='os-search-results-highlights' dangerouslySetInnerHTML={{ __html: page }}></p>
                  ))}
                  {hit.highlight.activity_name.map((activity: string) => (
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
          <p className='os-search-no-results'>Your query did not produce any results. Please try again.</p>
        </div>
      }
    </div>
  )
}
