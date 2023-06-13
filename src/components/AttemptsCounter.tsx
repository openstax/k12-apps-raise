interface Props {
  retryLimit: number
  retriesAllowed: number
}

export const AttemptsCounter = ({ retryLimit, retriesAllowed }: Props): JSX.Element => {
  return (
    <div className="os-flex os-justify-content-end">
      {retryLimit === 0
        ? (
          <p className="os-attempts-text">
            Attempts left: Unlimited
          </p>
          )
        : (
          <p className="os-attempts-text">
            Attempts left: {retryLimit - retriesAllowed + 1}/
            {retryLimit + 1}
          </p>
          )
      }
    </div>
  )
}
