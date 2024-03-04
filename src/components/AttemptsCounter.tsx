interface Props {
  retryLimit: number
  retriesAllowed: number
}

export const AttemptsCounter = ({ retryLimit, retriesAllowed }: Props): JSX.Element => {
  console.log('retryLimit:', retryLimit)
  console.log('retriesAllowed:', retriesAllowed)
  return (
    <div className="os-flex os-justify-content-end">
      <p className="os-attempts-text">
        Attempts left: {retryLimit - retriesAllowed + 1}/
        {retryLimit + 1}
      </p>
    </div>
  )
}
