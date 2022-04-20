interface CTABlockProps {
  buttonText: string
}

export const CTABlock = ({ buttonText }: CTABlockProps): JSX.Element => {
  return (
    <button type="button">{buttonText}</button>
  )
}
