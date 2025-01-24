import { Check } from '@tamagui/lucide-icons'
import { ComponentProps, forwardRef } from 'react'
import type { TamaguiElement } from 'tamagui'
import { Checkbox as TamaguiCheckbox } from 'tamagui'

export const Checkbox = forwardRef<TamaguiElement, ComponentProps<typeof TamaguiCheckbox>>((props, ref) => {
  return (
    <TamaguiCheckbox ref={ref} {...props}>
      <TamaguiCheckbox.Indicator>
        <Check />
      </TamaguiCheckbox.Indicator>
    </TamaguiCheckbox>
  )
})
