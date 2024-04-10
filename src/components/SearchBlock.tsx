import { Formik, Form, Field, ErrorMessage } from 'formik'
// import { useCallback, useContext, useState } from 'react'
// import { ENV } from '../lib/env'

// interface SearchBlockProps {
// }

export const SearchBlock = (): JSX.Element => {
  return (
    <div>
        <h1>HERE IS THE AMAZING SEARCHBLOCK</h1>
        <Formik
        initialValues={{ response: '' }}
        onSubmit={() => {}}
        validateOnBlur={false}
        >
        {() => (
            <Form>
            <Field
            name="response"
            as="textarea"/>
            <ErrorMessage className="text-danger my-3" component="div" name="response" />
            <div className='os-text-center mt-4'>
            <button type="submit" className="os-btn btn-outline-primary">Button</button>
            </div>
            </Form>
        )}
        </Formik>
    </div>
  )
}
