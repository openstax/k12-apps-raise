import React from 'react'

interface Props {
  retryLimit: number
  retriesAllowed: number
}

export const AttemptsCounter: React.FC<Props> = ({ retryLimit, retriesAllowed }) => (
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
            )}
    </div>
)
