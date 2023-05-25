import React from 'react'

interface Props {
  retryLimit: number
  retriesAllowed: number
}

export const AttemptsCounter: React.FC<Props> = ({ retryLimit, retriesAllowed }) => (
    <div className="os-raise-d-flex os-raise-justify-content-end">
        {retryLimit === 0
          ? (
                <p className="os-raise-attempts-text">
                    Attempts left: Unlimited
                </p>
            )
          : (
                <p className="os-raise-attempts-text">
                    Attempts left: {retryLimit - retriesAllowed + 1}/
                    {retryLimit + 1}
                </p>
            )}
    </div>
)
