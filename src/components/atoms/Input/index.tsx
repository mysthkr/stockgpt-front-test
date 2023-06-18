import styled, { css } from 'styled-components'

/**
 * テキストインプット
 */
const Input = styled.input<{ hasError?: boolean; hasBorder?: boolean }>`

  padding: 11px 12px 12px 9px;
  box-sizing: border-box;
  outline: none;
  width: 100%;
  height: 38px;
  font-size: 16px;
  line-height: 19px;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }
`

Input.defaultProps = {
  hasBorder: true,
}

export default Input
