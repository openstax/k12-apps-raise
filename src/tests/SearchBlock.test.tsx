import { act, fireEvent, render, screen } from '@testing-library/react'
import { SearchBlock } from '../components/SearchBlock'

const mockStudentAndTeacherQueryResults = {
  took: 55,
  timed_out: false,
  _shards: {
    total: 1,
    successful: 1,
    skipped: 0,
    failed: 0
  },
  hits: {
    total: {
      value: 37,
      relation: 'eq'
    },
    max_score: 12.129974,
    hits: [
      {
        _index: 'test-index2',
        _id: '1a9844da-0262-49c0-9194-1496f9cfc4ed',
        _score: 12.129974,
        _source: {
          content_id: '1a9844da-0262-49c0-9194-1496f9cfc4ed',
          section: 'Unit 4: Functions',
          activity_name: 'Lesson 4.16: Different Types of Sequences',
          lesson_page: '4.16.3: A Sequence Is a Type of Function',
          lesson_page_type: 'content',
          teacher_only: false
        },
        highlight: {
          lesson_page: [
            '4.16.3: A Sequence <strong>Is</strong> a Type of Function'
          ],
          visible_content: [
            'Activity \n<strong>Jada</strong> and Mai are trying to decide what type of sequence this could be:\n\n\n\n\nterm number\nvalue',
            '2\n      \n\n\n\n      2\n      \n\n        6\n      \n\n\n\n        5\n      \n\n        18\n      \n\n\n\n<strong>Jada</strong>',
            'says: \u201cI think this sequence <strong>is</strong> geometric because in the value column, each row <strong>is</strong> 3 times the previous',
            'Do you agree with <strong>Jada</strong> or Mai? Be prepared to show your reasoning using a graph.',
            '<strong>Jada</strong> noticed that each value <strong>is</strong> multiplied by 3 to get to the next row, but the table skips terms.'
          ]
        }
      },
      {
        _index: 'test-index2',
        _id: 'f27ad080-9923-48c5-9355-54e4934a95d8',
        _score: 11.537502,
        _source: {
          content_id: 'f27ad080-9923-48c5-9355-54e4934a95d8',
          section: 'Unit 4: Functions',
          activity_name: 'Lesson 4.14: Sequences',
          lesson_page: '4.14.2: What Is a Sequence?',
          lesson_page_type: 'content',
          teacher_only: false
        },
        highlight: {
          lesson_page: [
            '4.14.2: What <strong>Is</strong> a Sequence?'
          ],
          visible_content: [
            'What <strong>is</strong> the smallest number of moves in which you are able to complete the puzzle with 3 discs?',
            'Enter your answer here:\n\n\nCompare your answer:\n15 moves\n\n\n\n\n\n\n\n\n\n<strong>Jada</strong> says she used the solution for',
            'Enter your answer here:\n\n\nCompare your answer:\n<strong>Jada</strong> moved the tower of discs 1\u20133, then moved disc 4,',
            'The number of moves <strong>is</strong> 31 because \\(2\\cdot15+1=31\\).',
            'The term (of a sequence) <strong>is</strong> one of the numbers in a sequence.'
          ]
        }
      }
    ]
  }
}

const mockTeacherFilterQueryResults = {
  took: 55,
  timed_out: false,
  _shards: {
    total: 1,
    successful: 1,
    skipped: 0,
    failed: 0
  },
  hits: {
    total: {
      value: 37,
      relation: 'eq'
    },
    max_score: 12.129974,
    hits: [
      {
        _index: 'test-index1',
        _id: '1a9844da-0262-49c0-9194-1496f9cfc4ed',
        _score: 12.129974,
        _source: {
          content_id: '1a9844da-0262-49c0-9194-1496f9cfc4ed',
          section: 'Unit 4: Functions',
          activity_name: 'Lesson 4.16: Different Types of Sequences',
          lesson_page: '4.16.3: A Sequence Is a Type of Function',
          lesson_page_type: 'content',
          teacher_only: true
        },
        highlight: {
          lesson_page: [
            '4.16.3: A Sequence <strong>Is</strong> a Type of Function'
          ],
          visible_content: [
            'Activity \n<strong>Jada</strong> and Mai are trying to decide what type of sequence this could be:\n\n\n\n\nterm number\nvalue',
            '2\n      \n\n\n\n      2\n      \n\n        6\n      \n\n\n\n        5\n      \n\n        18\n      \n\n\n\n<strong>Jada</strong>',
            'says: \u201cI think this sequence <strong>is</strong> geometric because in the value column, each row <strong>is</strong> 3 times the previous',
            'Do you agree with <strong>Jada</strong> or Mai? Be prepared to show your reasoning using a graph.',
            '<strong>Jada</strong> noticed that each value <strong>is</strong> multiplied by 3 to get to the next row, but the table skips terms.'
          ]
        }
      }
    ]
  }
}

jest.mock('../lib/env.ts', () => ({
  ENV: {
    OS_RAISE_SEARCHAPI_URL_PREFIX: 'http://searchapi'
  }
}))
// Will need to update the url
describe('search', () => {
  it('fetches and displays student and teacher search results from API', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => await Promise.resolve(mockStudentAndTeacherQueryResults)
    })

    render(
      <SearchBlock versionId={'12345'} filter={''} />
    )

    const queryInput = screen.getByRole('textbox')
    await act(async () => {
      fireEvent.change(queryInput, { target: { value: 'math' } })
      fireEvent.click(screen.getByText('Button'))
    })

    await screen.findAllByText('Unit 4: Functions')
    const firstHitLessonPage = await screen.findAllByText('4.16.3', { exact: false })
    const secondHitLessonPage = await screen.findAllByText('4.14.2', { exact: false })
    expect(firstHitLessonPage.length === 2)
    expect(secondHitLessonPage.length === 2)
    expect(await screen.findByText('Lesson 4.16: Different Types of Sequences'))
    expect(await screen.findByText('Lesson 4.14: Sequences'))
    expect(await screen.findByText('table skips terms', { exact: false }))
    expect(await screen.findByText('smallest', { exact: false }))
    expect(global.fetch).toHaveBeenCalledWith(`http://searchapi?q=math&version_id=12345&filter=${''}`)
  })

  it('fetches and displays teacher filter search results from API', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => await Promise.resolve(mockTeacherFilterQueryResults)
    })

    render(
      <SearchBlock versionId={'67890'} filter={'teacher'} />
    )

    const queryInput = screen.getByRole('textbox')
    await act(async () => {
      fireEvent.change(queryInput, { target: { value: 'math' } })
      fireEvent.click(screen.getByText('Button'))
    })

    await screen.findByText('Unit 4: Functions')
    const firstHitLessonPage = await screen.findAllByText('4.16.3', { exact: false })
    expect(firstHitLessonPage.length === 1)
    expect(await screen.findByText('Lesson 4.16: Different Types of Sequences'))
    expect(await screen.findByText('table skips terms', { exact: false }))
    expect(await screen.findByText('This is teacher content'))
    expect(global.fetch).toHaveBeenCalledWith('http://searchapi?q=math&version_id=67890&filter=teacher')
  })
})
