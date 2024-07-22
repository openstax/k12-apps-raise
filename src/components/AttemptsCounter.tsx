interface Props {
  retryLimit: number
  retriesAllowed: number
}

export const AttemptsCounter = ({ retryLimit, retriesAllowed }: Props): JSX.Element => {
  return (
    <div className="os-ml-auto">
      <p className="os-attempts-text">
        Attempts left: {retryLimit - retriesAllowed + 1}/
        {retryLimit + 1}
      </p>
    </div>
  )
}
